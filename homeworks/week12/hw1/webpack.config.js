const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module:{
    rules:[{test: /\.js$/,exclude: /node_modules/,loader: 'babel-loader'}]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath:'/dist'
  }
};