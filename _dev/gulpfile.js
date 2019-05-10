const { watch, series, task, src, dest } = require('gulp'),
  $ = require('gulp-load-plugins')(),
  packageImporter = require('node-sass-package-importer'),
  notify = require('gulp-notify');

task('scss', () => {
  return src('./scss/**/*.scss')
    .pipe($.plumber({ errorHandler: notify.onError('scss Error: <%= error.message %>') }))
    .pipe($.sass({
      importer: packageImporter({
        extensions: ['.scss', 'css']
      })
    }))
    .pipe($.pleeease({
      "autoprefixer": { "browsers": ["last 3 versions"] },
      "filters": false,
      "rem": false,
      "mqpacker": true
    }))
    .pipe(dest('../src/assets/css/'))
})

task('watch', () => {
  watch('./scss/**/*.scss', task('scss'));
});

task('default', series('scss', 'watch'));
