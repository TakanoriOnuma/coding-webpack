const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../webpack.config.development');
const bundler = webpack(webpackConfig);

const webpackDevMiddlewareInstance = webpackDevMiddleware(bundler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true
  }
});

const server = browserSync({
  server: {
    baseDir: 'dist',
    middleware: [
      webpackDevMiddlewareInstance,
      webpackHotMiddleware(bundler)
    ]
  },
  files: [
    {
      match: ['./src/pug/**/*.pug'],
      fn: (event, file) => {
        webpackDevMiddlewareInstance.waitUntilValid(() => {
          console.log('finish');
          server.reload();
        });
      }
    }
  ]
});

const fs = require('fs');

setTimeout(() => {
  console.log(fs.existsSync('dist/index.html'));
}, 3000);
// fs.watch('dist/index.html', () => {
//   console.log('change');
// });
