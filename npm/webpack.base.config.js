const {resolve} = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs')

module.exports = {
    entry: {
        app: [resolve(__dirname, '../src') + '/app.js'],
        vendor: [
            'babel-polyfill',
            'react',
            'react-router-dom',
            'react-redux',
            'redux-thunk'
        ]
    },
    output: {
        path: resolve(__dirname, '../build'),
        filename: 'js/react/[name].js',
        publicPath: '/',
        chunkFilename: 'js/react/[id].[chunkhash].js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: resolve(__dirname, './../src'),
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react'],
                    plugins: [
                        "babel-plugin-transform-function-bind",
                        "babel-plugin-transform-object-rest-spread",
                        "transform-async-to-generator",
                    ]
                }
            },
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract("css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:10]")
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin("../build/css/bundle.css"),
    ],
    externals: {
        'site-config': JSON.stringify(require('./site-config.json'))
    }
};