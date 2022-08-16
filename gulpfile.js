const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const { src, dest, watch, series } = require('gulp');
const reload = browserSync.reload;
function style() {
  return gulp
    .src('./scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
}

function watching() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
  gulp.watch('./scss/*.scss');
  gulp.watch('*.html').on('change', reload);
}
exports.watching = watching;
exports.style = style;
exports.build = series(style, watch);
