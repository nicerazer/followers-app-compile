const { watch, src, dest, parallel } = require('gulp'),
        sass    = require('gulp-sass'),
        cssnano = require('gulp-cssnano'),
        concat = require('gulp-concat'),
        rename  = require('gulp-rename'),
        uglify = require('gulp-uglify');

function processTokeyFollower(){
  return src('../workstation/tokeyfollower/src/scss/main.scss')
  .pipe(rename("style.scss"))
  .pipe(sass().on('error', sass.logError))
  .pipe(dest('../workstation/tokeyfollower/src/css/'))
  .pipe(cssnano())
  .pipe(dest('../workstation/tokeyfollower/src/dist/'));
}

function processKakiFollower(){
  return src('../workstation/kakifollower/src/scss/main.scss')
  .pipe(rename("style.scss"))
  .pipe(sass().on('error', sass.logError))
  .pipe(dest('../workstation/kakifollower/src/css/'))
  .pipe(cssnano())
  .pipe(dest('../workstation/kakifollower/src/dist/'));
}

function processKakiJsFiles(){
  var directory = '../workstation/kakifollower/src/js/';
  var files = [
    '../workstation/kakifollower/src/js/aos.js',
    '../workstation/kakifollower/src/js/lighslider.js',
    '../workstation/kakifollower/src/js/script.js',
  ];
  return src(['../workstation/kakifollower/src/js/aos.js',
  '../workstation/kakifollower/src/js/lightslider.js',
  '../workstation/kakifollower/src/js/script.js'])
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(dest('../workstation/kakifollower/src/dist/'));
}

function init(){
  // Transfer vendor items from node modules into each folder
  // var lightslider = [
  //   './node_modules/lightslider/src/css',
  //   './node_modules/lightslider/src/img',
  //   './node_modules/lightslider/src/js'
  // ]
  // return src(lightslider, { base: 'src' })
  // .pipe(dest('../workstation/tokeyfollower/src/scss/vendor/'))
  // .pipe(dest('../workstation/kakifollower/src/scss/vendor/'));
}

exports.default = function(){
  init();
  processKakiJsFiles();
  watch('../workstation/commons/sass/*.scss', parallel(processTokeyFollower, processKakiFollower));
  watch('../workstation/tokeyfollower/src/scss/**/*.scss', processTokeyFollower);
  watch('../workstation/kakifollower/src/scss/**/*.scss', processKakiFollower);
}