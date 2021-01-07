const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    libraryTarget: "umd", // very important line
    umdNamedDefine: true, // very important line
    globalObject: "this",
  },
};
