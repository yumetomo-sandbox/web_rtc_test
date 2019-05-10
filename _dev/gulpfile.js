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
    .pipe(dest('../../src/webroot/2019/'))
})

task('scss_sp', () => {
  return src('./scss_sp/**/*.scss')
    .pipe($.plumber({ errorHandler: notify.onError('scss_sp Error: <%= error.message %>') }))
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
    .pipe(dest('../../src/webroot/spn/2019/'))
})

task('watch', () => {
  watch('./scss/**/*.scss', task('scss'));
  watch('./scss_sp/**/*.scss', task('scss_sp'));
});

task('default', series('scss', 'scss_sp', 'watch'));
