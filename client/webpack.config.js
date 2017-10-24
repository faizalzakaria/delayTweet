const HtmlWebpackPlugin = require('html-webpack-plugin')

// webpack.config.js
module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
}
