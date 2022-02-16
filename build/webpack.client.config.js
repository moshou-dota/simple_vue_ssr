const path = require("path");
const webpack = require("webpack");
const base = require("./webpack.base.config");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = merge(base, {
  entry: {
    app: path.resolve(__dirname, "../src/entry-client.js"),
  },
  module: {
    rules: [
      // MiniCssExtractPlugin 不兼容服务器端: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/90
      // 不要同时使用 style-loader 与 mini-css-extract-plugin: https://webpack.docschina.org/plugins/mini-css-extract-plugin/#examples
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "vue-style-loader",  // 注意这里要使用 vue-style-loader，因为它对ssr做了兼容处理
          {
            loader: "css-loader",
            options: {
              importLoaders: 2, // importLoaders 选项允许你配置在 css-loader 之前有多少 loader 应用于 @imported 资源与 CSS 模块/ICSS 导入。
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
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
      "process.env.VUE_ENV": '"client"',
    }),
    new VueSSRClientPlugin(),
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
