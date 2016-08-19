var path = require('path');
var webpack = require('webpack');

module.exports = {
    watch: true,
    devtool: 'source-map',
    context: __dirname,

    entry: [
        './src/index.js'
    ],

    output: {
        path: path.resolve('./js'),
        filename: 'bundle.js',
        chunkFilename: '[id].js',
        publicPath: './js/'
    },

    resolve: {
        alias: {
            '~': path.resolve(__dirname)
        },
        extensions: ['', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel?presets[]=es2015,presets[]=stage-1',
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.css?$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            }
        ]
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin()
    ],
    external: {
        'pixi.js': 'PIXI',
    }
};
