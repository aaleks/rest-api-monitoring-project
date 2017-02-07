/* eslint strict: 0 */
'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base.js');


const config = Object.create(baseConfig);

//config.devtool = 'source-map';

config.entry = {
    index: './src/index'
    //  login: './app/login'
}

config.output.publicPath = '../server/public/';

config.module.loaders.push({
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?postcss!sass'),
    }
);

config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        '__DEV__': false,
        '__DEVTOOLS__': false, //set it to true in dev mode
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            screw_ie8: true,
            warnings: false
        }
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('stylesheets/style.css', {allChunks: true})
);


module.exports = config;
