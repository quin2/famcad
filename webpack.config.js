const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
     }),
   ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
  	contentBase: 'dist'
  },
  optimization: {
  	runtimeChunk: 'single',
  	moduleIds: 'deterministic',
     splitChunks: {
       chunks: 'all',
	      maxInitialRequests: Infinity,
	      minSize: 0,
	      cacheGroups: {
	        vendor: {
	          test: /[\\/]node_modules[\\/]/,
	          name(module) {
	            // get the name. E.g. node_modules/packageName/not/this/part.js
	            // or node_modules/packageName
	            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

	            // npm package names are URL-safe, but some servers don't like @ symbols
	            return `npm.${packageName.replace('@', '')}`;
	          },
	        },
	      },
     },
   },
};;