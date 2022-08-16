const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const { src, dest, watch, series } = require('gulp');
const prefixer = require('gulp-autoprefixer');
const terser = require('gulp-terser');
const minify = require('gulp-clean-css');
const webp = require('gulp-webp');
const imagemin = import('gulp-imagemin');
const mozjpeg = import('imagemin-mozjpeg');
const pngquant = import('imagemin-pngquant');
const optipng = import('imagemin-optipng');
const reload = browserSync.reload;

function style() {
  return src('./scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(minify())
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream());
}
// js files
function jsmin() {
  return src('js/*.js').pipe(terser()).pipe(dest('./dist/js'));
}

// image loading
async function imgOp() {
  return await src('./images/**/*.{jpg,png}')
    .pipe(
      imagemin([
        // pngquant({ quality: [0.5, 0.5] }),
        mozjpeg({ quality: 80, progressive: true }),
        optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(dest('./dist/images'));
}

function webpImg() {
  return src('dist/images/*.{jpg,png}')
    .pipe(webp())
    .pipe(dest('./dist/images'));
}

function watching() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
  watch('./scss/*.scss', style);
  watch('./images/**/*.{jpg,png}', imgOp);
  watch('./images/**/*.{jpg,png}', webpImg);
  watch('*.html').on('change', reload);
}

exports.default = series(style, jsmin, webpImg, watching);
