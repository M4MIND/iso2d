var webpack = require('webpack'),
  path = require('path')

module.exports = {
  entry: {
    iso2d: './index.js'
  },
  output: {
    library: 'iso2d',
    libraryTarget: 'umd',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: '[file].map'
  },

  module: {
    loaders: [
      {
        test: path.resolve(__dirname, 'src'), //Regular expression 
        loader: "babel-loader"
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'test'),
    overlay: true,
  },
  stats: {
    // Nice colored output
    colors: true
  },
  devtool: 'source-map',
};
