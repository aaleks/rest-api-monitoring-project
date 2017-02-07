/* eslint strict: 0 */
'use strict';

const webpack = require('webpack');
const baseConfig = require('./webpack.config.base.js');

const serverAddr = 'http://localhost:3000';

const config = Object.create(baseConfig);

config.debug = true;

config.devtool = 'cheap-module-eval-source-map';
//config.devtool = 'source-map';

/*
 config.entry = [
 'webpack-hot-middleware/client?path='+serverAddr+'/__webpack_hmr',
 './app/index'
 ];*/

config.entry = {
    index: [
     //   'eventsource-polyfill', // necessary for hot reloading with IE
        'webpack-hot-middleware/client',
        './src/index'
    ]/*,
     login: [
     'webpack-hot-middleware/client?path=' + serverAddr + '/__webpack_hmr',
     './app/login'
     ]*/
}

config.output.filename = 'js/[name]Bundle.js',

//config.output.publicPath = '/assets/';
//config.output.publicPath = serverAddr + '/assets/';
    config.output.publicPath =  '/public/';

config.module.loaders.push(
    {
        test: /(\.scss|\.css)$/,
        loader: 'style!css?postcss!sass'
    }
);

config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
        '__DEV__': true,
        'process.env': {
            'NODE_ENV': JSON.stringify('development')
        },
        __CLIENT__: true,
        __SERVER__: false,
        __DEVELOPMENT__: true,
        __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    })
);

module.exports = config;
