/* eslint strict: 0 */
'use strict';

const path = require('path');
const DIST_DIR = path.resolve(__dirname, '../server/public/');


module.exports = {

module: {
  target: 'web',
  loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    },{ test: /\.json$/, loader: "json-loader" },
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=fonts/[name].[ext]" },
      {test: /\.(woff2|woff)(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&name=fonts/[name].[ext]&minetype=application/font-woff"}]
  },
  output: {
    path: DIST_DIR,
    filename: 'js/[name]Bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css', '.json'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [],
  externals: [//nodeModules
  ]
};
