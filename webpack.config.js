const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const DonePlugin = require("./plugins/done-plugin");
// const WebpackAssetsPlugin = require("./plugins/WebpackAssetsPlugin");
// const AutoExternalsPlugin = require("./plugins/AutoExternalsPlugin");
// const WebpackBundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
// const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
  },
  output: {
    // path: path.join(__dirname, "dist"),
    // filename: "[name].js",
    // publicPath: 'https://cdn.example.com/',
  },
  optimization: {},
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
            'style-loader',
            {
            loader: "css-loader",
            options: {
              import: true,
              url: true,
            },
          }]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};
