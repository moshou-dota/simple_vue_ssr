const path = require("path");
const webpack = require("webpack");
const base = require("./webpack.base.config");
const { merge } = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = merge(base, {
  entry: path.resolve(__dirname, "../src/entry-server.js"),
  target: "node",
  devtool: "source-map",
  output: {
    filename: "server-bundle.js",
    library: {
      type: "commonjs2",
    },
  },
  // https://www.npmjs.com/package/webpack-node-externals
  externalsPresets: { node: true },
  externals: [
    nodeExternals({
      // 对于服务端来说，在运行时再去从外部获取这些扩展依赖性能更好
      allowlist: [/\.css$/], // 允许css文件打包进bundle，加快页面样式渲染
    }),
  ], // in order to ignore all modules in node_modules folder
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          "vue-style-loader", // 注意这里要使用 vue-style-loader，因为它对ssr做了兼容处理
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      "process.env.VUE_ENV": '"server"',
    }),
    new VueSSRServerPlugin(),
  ].concat(
    isProd
      ? [
          new MiniCssExtractPlugin({
            filename: "css/[name].[fullhash:8].css",
          }),
        ]
      : []
  ),
});
