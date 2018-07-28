const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'dist/phaser.min.js');

const ROOT = __dirname;
const SRC = path.resolve(ROOT, 'src');

function getFolders(srcpath) {
  return fs.readdirSync(srcpath)
    .map(folder => ({ name: folder, pathname: path.resolve(SRC, folder) }))
    .filter(({ pathname }) => fs.lstatSync(pathname).isDirectory());
}

module.exports = (env = {}) => {
  const DEV = JSON.stringify(JSON.parse(env.dev || true));
  const folders = getFolders(SRC);
  const compile = [];

  if (env.instance !== undefined) {
    const instance = folders.find(({ name }) => name === env.instance);
    if (!instance) throw new Error('Pass an existing instance.');
    compile.push(instance);
  } else {
    compile.push(...folders);
  }

  const config = compile.map(({ name, pathname }) => ({
    watch: true,
    devtool: 'cheap-source-map',
    entry: {
      app: [
        'babel-polyfill',
        path.resolve(pathname, 'src/main.js'),
      ],
      vendor: ['phaser', 'webfontloader'],
    },
    output: {
      pathinfo: true,
      path: path.resolve(ROOT, 'dist', name),
      publicPath: '',
      hashDigestLength: 5,
      filename: 'bundle.js',
    },
    plugins: [
      new CleanWebpackPlugin([path.resolve('dist', name)]),
      new webpack.DefinePlugin({ __DEV__: DEV }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'/* chunkName= */,
        filename: 'vendor.bundle.js', /* filename= */
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(pathname, 'index.html'),
        chunks: ['vendor', 'app'],
        chunksSortMode: 'manual',
        minify: {
          removeAttributeQuotes: false,
          collapseWhitespace: false,
          html5: false,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          removeComments: true,
          removeEmptyAttributes: true,
        },
        hash: false,
      }),
      new ExtractTextPlugin('style.css'),
      new CopyWebpackPlugin([{
        from: path.resolve(pathname, 'assets/**'),
        to: path.resolve(ROOT, 'dist', name, 'assets'),
        context: path.resolve(pathname, 'assets'),
      }]),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(pathname, 'src'),
          loader: 'babel-loader',
          query: { presets: ['env'] },
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader',
          }),
          exclude: /node_modules/,
        },
      ],
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
    resolve: { alias: { phaser } },
  }));

  return config;
};
