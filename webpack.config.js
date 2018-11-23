const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge');
const StatsGraphPlugin = require('./StatsGraphPlugin');
const babelLoader = require('./babelLoader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const codeGenConfig = require('./codegen');

module.exports = function (env) {
  const isDevelopment = env === 'development';
  console.log(`This is a ${isDevelopment ? 'development' : 'production'} build.`);

  const baseConfig = {
    entry: './app/app.js',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'app/dist'),
      filename: 'app.bundle.js',
      publicPath: '/dist/',
    },
    plugins: [
      new CleanWebpackPlugin([
        'app/dist'
      ]),
      new webpack.DefinePlugin({
        ENV_IS_DEVELOPMENT: isDevelopment,
        ENV_IS: JSON.stringify(isDevelopment ? 'development' : 'production'),
      })
    ]
  };

  if (isDevelopment) {
    return webpackMerge(baseConfig, {
      devServer: {
        contentBase: path.resolve(__dirname, 'app'),
        publicPath: '/dist/',
        watchContentBase: false,
        hotOnly: true,
        overlay: true,
        host: '0.0.0.0'
      },
      plugins: [
        new NpmInstallPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new StatsGraphPlugin()
      ]
    }, codeGenConfig);
  } else {
    return webpackMerge(baseConfig, babelLoader);
  }
}
