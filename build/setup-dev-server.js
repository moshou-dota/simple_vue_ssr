const fs = require("fs");
const path = require("path");
const MFS = require("memory-fs");
const webpack = require("webpack");
const chokidar = require("chokidar");
const clientConfig = require("./webpack.client.config");
const serverConfig = require("./webpack.server.config");

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), "utf-8");
  } catch (error) {}
};

module.exports = function setupDevServer(server, templatePath, cb) {
  let boudle, template, clientManifest;

  let ready;
  const readyPromise = new Promise((r) => (ready = r));

  function update() {
    if (boudle && clientManifest) {
      ready();
      cb(boudle, {
        template,
        clientManifest,
      });
    }
  }

  template = fs.readFileSync(templatePath, "utf-8");
  chokidar.watch(templatePath).on("change", () => {
    template = fs.readFileSync(templatePath, "utf-8");
    console.log("index.template.html update");
    update();
  });
  // 通过 server + webpack-hot-middleware + webpack-dev-middleware 自定义server热更新
  // Add 'webpack-hot-middleware/client' into the entry array.
  // This connects to the server to receive notifications
  // when the bundle rebuilds and then updates your client bundle accordingly.
  // 详见其文档：https://www.npmjs.com/package/webpack-hot-middleware
  clientConfig.entry.app = [
    "webpack-hot-middleware/client",
    clientConfig.entry.app,
  ];
  clientConfig.output.filename = "[name].js";
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin() // Use NoErrorsPlugin for webpack 1.x
  );
  // Compiler实例
  // 详见官方文档：https://webpack.docschina.org/api/node/#compiler-instance
  const clientCompiler = webpack(clientConfig);
  // 告知 express 使用 webpack-dev-middleware，
  // 以及将 webpack.client.config 配置文件作为基础配置。
  // https://webpack.docschina.org/guides/development/#using-webpack-dev-middleware
  const devMiddleware = require("webpack-dev-middleware")(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
  });
  server.use(devMiddleware);

  // 在 compilation 完成时执行。这个钩子 不会 被复制到子编译器。
  // https://webpack.docschina.org/api/compiler-hooks/#done
  clientCompiler.hooks.done.tap("getClientManifest", (stats) => {
    // plugin name: "Myplugin" 是自定义的，可以实任何String
    stats = stats.toJson();
    stats.errors.forEach((err) => console.error(err));
    stats.warnings.forEach((err) => console.warn(err));
    if (stats.errors.length) return;
    clientManifest = JSON.parse(
      clientCompiler.outputFileSystem.readFileSync(
        path.resolve(__dirname, '../dist/vue-ssr-client-manifest.json'),
        'utf-8'
      )
    )
    update();
  });

  server.use(
    require("webpack-hot-middleware")(clientCompiler, { heartbeat: 5000 })
  );

  // 调用 watch 方法会触发 webpack 执行，但之后会监听变更（很像 CLI 命令: webpack --watch），
  // 一旦 webpack 检测到文件变更，就会重新执行编译。
  const serverCompiler = webpack(serverConfig);
  // 自定义文件系统
  // 默认情况下，webpack 使用普通文件系统来读取文件并将文件写入磁盘
  // 通过写入内存提高性能
  // https://webpack.docschina.org/api/node/#custom-file-systems
  const mfs = new MFS(); //
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;
    boudle = JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json"));
    update();
  });

  return readyPromise;
};
