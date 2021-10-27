const path = require('path')
const webpack = require('webpack')
const base = require("./webpack.base.config");
const { merge } = require("webpack-merge");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
module.exports = merge(base, {
  entry: {
    app: path.resolve(__dirname, "../src/entry-client.js"),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new VueSSRClientPlugin()
  ],
});
