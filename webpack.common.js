const path = require("path");

module.exports = {
  entry: {
    app: "./js/app.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: false,
    filename: "./js/app.js",
  },
};
