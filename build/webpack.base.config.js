const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, '../dist')
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      },
      {
        test: /\.(png|gif|jpg|jpeg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        },
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}