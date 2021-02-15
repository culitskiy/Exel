
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
console.log(isDev);

const options = {
    exclude: 'node_modules',
    extensions: 'jsx',
    overrideConfigFile: '.eslintrc.json',
    emitError: true,
    emitWarning: true,
    failOnWarning: false,
};

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

function jsLoaders() {
    const loaders = [
        {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    ]
    if (isDev) {
        loaders.push(new ESLintPlugin(options));
    }


    return loaders;
}
 
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: ['@babel/polyfill', './index.js'],
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@core': path.resolve(__dirname, 'src/core')
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: 'index.html',
            minify: {
                removeComents: !isDev,
                collapseWhitespace: !isDev,
            }
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders(),
                // use: {
                //     loader: 'babel-loader',
                //     options: {
                //     presets: ['@babel/preset-env']
                //     }
                // }
            }
        ],
    },
    devServer: {
        contentBase: false,
        // index: 'index.html',
        historyApiFallback: true,
        host: '127.0.0.1',
        port: 8080,
        clientLogLevel: 'debug',
    },
    devtool: isDev ? 'source-map' : false
}