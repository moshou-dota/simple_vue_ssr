const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: isProd
  ? false
  : 'cheap-module-source-map',
  output: {
    publicPath: '/dist/', // 这里的配置和node服务器代理的配置相关
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../dist')
  },
  mode: 'none',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // 通过不解析某些库来提高性能
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false // 放弃模板标签之间的空格, 这能够略微提升一点性能但是可能会影响到内联元素的布局
          }
        }
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bowder_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|gif|jpg|jpeg|gif|svg)$/,
        type: 'asset', // More information here https://webpack.js.org/guides/asset-modules/
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        },
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        type: "asset",
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
}