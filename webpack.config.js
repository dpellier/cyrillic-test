const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.NODE_ENV || 'local';
const isLocal = ENV === 'local';

module.exports = function webpackConfig() {
    const config = {};
    const outputPath = __dirname + '/dist';

    config.entry = [
        './src/index.js'
    ];

    config.output = {
        path: outputPath,
        publicPath: isLocal ? 'http://localhost:8081/' : '',
        filename: isLocal ? '[name].bundle.js' : '[name].[hash].js',
        chunkFilename: isLocal ? '[name].bundle.js' : '[name].[hash].js'
    };

    if (isLocal) {
        config.devtool = 'eval-source-map';
    } else {
        config.devtool = 'source-map';
    }

    config.module = {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    {loader: 'css-loader', options: {minimize: true}},
                    {loader: 'postcss-loader', options: {sourceMap: true}},
                    {loader: 'sass-loader', options: {sourceMap: true}}
                ]
            }),
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    {loader: 'css-loader', query: {sourceMap: true}},
                    {loader: 'postcss-loader', options: {sourceMap: true}}
                ]
            })
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file-loader'
        }, {
            test: /\.html$/,
            loader: 'raw-loader'
        }]
    };

    config.plugins = [
        new CleanWebpackPlugin(['dist']),
        new webpack.LoaderOptionsPlugin({
            test: /\.scss$/i,
            options: {
                postcss: {
                    plugins: [autoprefixer]
                }
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            disable: isLocal,
            allChunks: true
        })
    ];

    if (!isLocal) {
        config.plugins.push(
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.AggressiveMergingPlugin()
        );
    }

    config.devServer = {
        contentBase: './src',
        stats: 'minimal',
        port: 8081,
        historyApiFallback:{
            index: 'http://localhost:8081/'
        }
    };

    return config;
}();
