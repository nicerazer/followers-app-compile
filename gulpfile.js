const { watch, src, dest, parallel } = require('gulp'),
        fancyLog  = require('fancy-log'),
        logger    = require('gulp-logger'),
        webserver = require('gulp-webserver'),
        twig      = require('gulp-twig'),
        sass      = require('gulp-sass'),
        cssnano   = require('gulp-cssnano'),
        concat    = require('gulp-concat'),
        rename    = require('gulp-rename'),
        uglify    = require('gulp-uglify');

const workpath = './_workstation/';

const compileStyleSheet = site => {
  return src(`${workpath}${site}/src/scss/main.scss`)
    .pipe(logger({
      before: `Sass start compilation : ${site}`,
      after: `Sass end compilation : ${site}`,
      extname: `.scss`,
    }))
    .pipe(rename('style.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(`${workpath}${site}/src/css/`))
    .pipe(cssnano())
    .pipe(dest(`${workpath}${site}/src/dist/`));
}

const compileKakiJsFiles = () => {
  // console.log("Processing Kaki Js Files");
  let directory = 'kakifollower/src/';
  return src([
    `${workpath}${directory}js/aos.js`,
    `${workpath}${directory}js/lightslider.js`,
    `${workpath}${directory}js/script.js`])
  .pipe(logger({
    before: `JS start compilation : KakiFollower`,
    after: `JS end compilation : KakiFollower`,
    extname: `.js`,
  }))
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(dest(`${workpath}${directory}dist/`));
}

const processTwig = (_path, _data) => {
  return src(_path)
  .pipe(twig({
    data: _data
  }))
  .pipe(logger({
    before: `Twig compilation : ?`,
    after: `Twig : ?`,
    extname: `.twig`,
  }))
  .pipe(dest(`${workpath}${directory}twig/compiled/`));
}

exports.default = done => {
  const site = ['tokeyfollower', 'kakifollower'];
  compileKakiJsFiles();
  // THIS IS CLOSURE!!!! :D
  console.log("Watch commons");
  watch(`${workpath}commons/sass/*.scss`, parallel(
    // We pass in anonymous arrow functions as callback functions
    (() => compileStyleSheet(site[0])),
    (() => compileStyleSheet(site[1]))
  ));
  console.log("Pre sass");
  site.forEach((i, iteration) => {
    // console.log(`Processing sass for ${iteration}`);
    // console.log("Watch main");
    compileStyleSheet(i);
    watch(`${workpath}${i}/src/scss/**/*.scss`, () => compileStyleSheet(i));
  });
  console.log("Post sass");
  src(`./`)
  .pipe(webserver({
    livereload: true,
    directoryListing: true,
    open:`http://localhost:8000/_workstation/${site[0]}/content-home.html`
  }));
  done();
}

/*
const processVendor = () => {
  Transfer vendor items from node modules into each folder
  var lightslider = [
    './node_modules/lightslider/src/css',
    './node_modules/lightslider/src/img',
    './node_modules/lightslider/src/js'
  ]
  return src(lightslider, { base: 'src' })
  .pipe(dest('../workstation/tokeyfollower/src/scss/vendor/'))
  .pipe(dest('../workstation/kakifollower/src/scss/vendor/'));
}
*/
