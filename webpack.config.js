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
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-class-properties']
        }
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'test'),
    overlay: true,
    disableHostCheck: true
  },
  stats: {
    // Nice colored output
    colors: true
  },
  devtool: 'source-map',
};
