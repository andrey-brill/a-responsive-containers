
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "production",
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
        library: 'ResponsiveContainers',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                use: ['url-loader'],
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(buildBanner())
    ]
};

function buildBanner () {

    const { version, name, license, repository, author } = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));

    return `
        ${name} v${version}
        ${repository.url}

        Copyright (c) ${author.replace(/ *\<[^)]*\> */g, " ")}

        This source code is licensed under the ${license} license
        found in the LICENSE file in the root directory of this source tree.
    `;
}
