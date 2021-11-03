const path = require("path");
const resolve = (file) => path.resolve(__dirname, file);
const express = require("express");
const server = express();
const favicon = require('serve-favicon')
const { createBundleRenderer } = require("vue-server-renderer");
const isProd = process.env.NODE_ENV === "production";
const templatePath = path.resolve("./index.template.html");

let renderer;
let readyPromise;

function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      // baseDir: resolve('./dist'), // 只有使用 npm link 的时候需要添加此选项
      runInNewContext: false, // 推荐关闭以提升性能
    })
  );
}

if (isProd) {
  const serverBundle = require("./dist/vue-ssr-server-bundle.json");
  const clientManifest = require("./dist/vue-ssr-client-manifest.json");

  const template = require("fs").readFileSync(templatePath, "utf-8");
  renderer = createBundleRenderer(serverBundle, {
    template,
    clientManifest,
  });
} else {
  readyPromise = require("./build/setup-dev-server")(
    server,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options);
    }
  );
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

server.use(favicon(__dirname + '/public/logo-48.png'))
server.use('/dist', serve('./dist', true))
server.use('/public', serve('./public', true))
// server.use(express.static(resolve("./dist")));

function render (req, res) {
  const context = { url: req.url, title: "vue ssr demo" };
  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.error("有一个错误", err);
      if (err.code === 404) {
        res.status(404).end("Page not found");
      } else {
        res.status(500).end("Internal Server Error");
      }
    } else {
      res.end(html);
    }
  });
}

server.get("*", isProd? render: (req, res) => {
  readyPromise.then(() => render(req, res))
});

const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})

process.on("uncaughtException", (err) => {
  console.error("有一个未捕获的错误", err);
  process.exit(1); //强制性的（根据 Node.js 文档）
});
