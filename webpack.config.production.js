const path = require('path');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const baseConfig = require('./webpack.config.base.js');
const config = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ]
});

/**
 * CSSのルール設定を取得する
 * @param {string} cssModulePath - CSSモジュールのパス
 * @returns {Array<Object>} - CSSモジュールとそうでない場合のルール設定
 */
function getCssRules(cssModulePath) {
  return [true, false].map((isCssModule) => ({
    test: /\.(sass|scss)$/,
    include: isCssModule ? cssModulePath : undefined,
    exclude: isCssModule ? undefined : cssModulePath,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: isCssModule,
          localIdentName: '[name]-[local]-[hash:base64:5]',
          // 0 => no loaders (default);
          // 1 => postcss-loader;
          // 2 => postcss-loader, sass-loader
          importLoaders: 2
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: (loader) => [
            // new IconfontWebpackPlugin(loader),
            autoprefixer({
              browsers: [
                'last 2 version',
                'IE 11'
              ]
            }),
            cssnano()
          ]
        }
      },
      {
        loader: 'sass-loader',
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [path.resolve('./src/css/resources/*.scss')]
        }
      }
    ]
  }));
}

config.module.rules.push(...getCssRules(path.resolve(__dirname, './src/javascripts/')));

module.exports = config;
