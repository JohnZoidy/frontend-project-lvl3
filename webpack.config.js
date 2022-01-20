const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // MiniCssExtractPlugin.loader,
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    // new MiniCssExtractPlugin(),
  ],
};
