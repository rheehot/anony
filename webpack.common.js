const webpack = require('webpack')
const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin

module.exports = {
  entry: {
    index: ['@babel/polyfill', './src/index.js'],
    react: ['react', 'react-dom', 'react-router-dom', 'react-bootstrap'],
  },

  //entry: './src/index.js',

  output: {
    path: __dirname + '/public/',
    publicPath: '/', // chunk 파일을 / 에서 로드하도록 설정
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
          },
        },
      },
      {
        test: /\.(s*)css$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS
        ],
      },
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'all', // include all types of chunks
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 10,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        default: false,
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@@': path.resolve(__dirname), // project root
    },
  },
}
