const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "none",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: false,
    }),
    new CopyPlugin({
      patterns: [
        { from: "img", to: "img" },
        { from: "fonts", to: "fonts" },
        { from: "css", to: "css" },
        { from: "js/vendor", to: "js/vendor" },
      ],
    }),
  ],
});
