const { watch, src, dest, parallel } = require('gulp'),
        webserver = require('gulp-webserver'),
        twig      = require('gulp-twig'),
        sass      = require('gulp-sass'),
        cssnano   = require('gulp-cssnano'),
        concat    = require('gulp-concat'),
        rename    = require('gulp-rename'),
        uglify    = require('gulp-uglify');

const workpath = './_workstation/';

const processStyleSheet = site => {
  console.log("Processing stylesheet: %s" , site);
  console.log(`${workpath}${site}/src/scss/main.scss`);
  return src(`${workpath}${site}/src/scss/main.scss`)
  .pipe(rename('style.scss'))
  .pipe(sass().on('error', sass.logError))
  .pipe(dest(`${workpath}${site}/src/css/`))
  .pipe(cssnano())
  .pipe(dest(`${workpath}${site}/src/dist/`));
}

const processKakiJsFiles = () => {
  console.log("Processing Kaki Js Files");
  let directory = 'kakifollower/src/';
  return src([
    `${workpath}${directory}js/aos.js`,
    `${workpath}${directory}js/lightslider.js`,
    `${workpath}${directory}js/script.js`])
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(dest(`${workpath}${directory}dist/`));
}

const processTwig = (_path, _data) => {
  console.log("Processing twig");
  return src(_path)
  .pipe(twig({
    data: _data
  }))
  .pipe(dest(`${workpath}${directory}twig/compiled/`));
}

exports.default = done => {
  let site = ['tokeyfollower', 'kakifollower'];
  processKakiJsFiles();
  // THIS IS CLOSURE!!!! :D
  console.log("Watch commons");
  watch(`${workpath}commons/sass/*.scss`, parallel(
    // We pass in anonymous arrow functions as callback functions
    (() => processStyleSheet(site[0])),
    (() => processStyleSheet(site[1]))
  ));
  console.log("Pre sass");
  site.forEach((i, iteration) => {
    console.log(`Process sass of ${iteration}`);
    console.log("Watch main");
    processStyleSheet(i);
    watch(`${workpath}${i}/src/scss/**/*.scss`, () => processStyleSheet(i) );
  });
  console.log("Post sass");
  src(`./`)
  .pipe(webserver({
    livereload: true,
    directoryListing: true,
    // open:`http://localhost:8000/_workstation/${site[0]}/content-home.html`
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
