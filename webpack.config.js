const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const DonePlugin = require("./plugins/done-plugin");
// const WebpackAssetsPlugin = require("./plugins/WebpackAssetsPlugin");
// const AutoExternalsPlugin = require("./plugins/AutoExternalsPlugin");
// const WebpackBundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
// const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

// const webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
    // filename: "[name].js",
    // publicPath: 'https://cdn.example.com/',
  },
  optimization: {
    // minimizer: [
    //   new TerserPlugin({
    //     terserOptions: {
    //       output: {
    //         comments: false // 此配置最重要，无此配置无法删除声明注释
    //       },
    //       format: {
    //         comments: false,
    //       },
    //     },
    //     extractComments: false,
    //   })
    // ]
  },
  resolveLoader: {
    // modules: [path.join(__dirname, 'loaders'), 'node_modules']
    modules: [path.join(__dirname, 'lib/src'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          // "to-string-loader",
          {
            loader: "css-loader",
            options: {
              // url: false,
              // import: true,
              // // esModule: false,
              importLoaders: 1
            },
          },
          {
            loader: 'postcss-loader',
            
          }
        ],
        include: path.resolve("src"),
      },
      {
        test:/\.less$/,
        use:[
            // "style-loader",
          "to-string-loader",
            {
                loader:'css-loader',
                options:{
                    // import: true,
                    // url: false,
                    // esModule: false,
                    importLoaders: 1
                }
            },
            {
              loader: 'postcss-loader',
            
            },
            'less-loader'
        ],
      },
      // {
      //   test: /\.m?js$/,
      //   exclude: /(node_modules|bower_components)/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: ["@babel/preset-env"],
      //     },
      //   },
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // new CleanWebpackPlugin()
  ],
};
