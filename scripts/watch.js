const gaze = require('gaze');
const fs = require('fs');
const path = require('path');

// 自動出力している旨を記述しているコメント文字列
const AUTO_COMMENT_STR = [
  '/**',
  ' * @file pugをimportするだけのファイル（自動で出力しているので編集しないでください）',
  ' */'
].join('\n');

/**
 * pugファイル名を受け取ってimportする文を書く
 * @param {string} pugFileName - pugファイル名
 * @returns {string} - import文
 */
function getImportStr(pugFileName) {
  return 'import '
    + `'`
    + '!file-loader?' + JSON.stringify({ name: '[name].html '})
    + '!extract-loader'
    + '!html-loader'
    + '!pug-html-loader?' + JSON.stringify({ pretty: true, data: { data: 10 }})
    + `!../pug/${pugFileName}`
    + `';`;
}

/**
 * pugファイルのimport文を書く
 * @param {string} dirPath - 監視対象のディレクトリパス
 */
function _autoImportPugFiles(dirPath) {
  fs.readdir(dirPath, (err, list) => {
    const pugFiles = list.filter((fileName) => /\.pug$/.test(fileName));

    // codeに出力するコードを書く
    const codeStr = [
      AUTO_COMMENT_STR,
      '',
      pugFiles.map((pugFile) => getImportStr(pugFile)).join('\n'),
      ''
    ].join('\n');

    // ファイルに出力
    fs.writeFile(path.resolve(__dirname, '../src/javascripts/pugImport.js'), codeStr, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
}

/**
 * pugファイルの監視してimport文を更新する
 * @param {string} dirPath - 監視対象のディレクトリパス
 */
function autoImportPugFiles(dirPath) {
  const relativePath = path.relative(__dirname, dirPath);
  const watchFiles = [
    `${relativePath}/*.pug`
  ];
  // ファイルの監視
  gaze(watchFiles, { cwd: __dirname }, (err, watcher) => {
    if (err) throw err;
    watcher.on('all', () => {
      _autoImportPugFiles(dirPath);
    });
  });
  // 先に一度Indexを生成する
  _autoImportPugFiles(dirPath);
}

autoImportPugFiles(path.resolve(__dirname, '../src/pug'));
