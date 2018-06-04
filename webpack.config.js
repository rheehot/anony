const webpack = require('webpack');

module.exports = {
    entry: ['react-hot-loader/patch', './src/index.js'] ,

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

    devServer: {
        hot: true,
        inline: true,
        host: '0.0.0.0',
        port: 7777,
        contentBase: __dirname + '/public/',
        disableHostCheck: true,
        proxy: {
            "*": "http://localhost:8080"
        }
    },

    module:{
        loaders: [
            {
                test: /.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react'],
                    plugins: ["react-hot-loader/babel"]
                }
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
