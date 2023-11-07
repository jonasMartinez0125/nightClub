const { series, src, dest, watch } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const imagemin = require("gulp-imagemin");
const notify = require("gulp-notify");
const webp = require("gulp-webp");
const concat = require("gulp-concat");
// css utilities
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");
// javascript utilities
const terser = require("gulp-terser-js");
const rename = require("gulp-rename");

const paths = {
    images: "src/img/**/*",
    scss: "src/scss/**/*.scss",
    js: "src/js/**/*.js"
};

// sass compile
function css(){
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write("."))
        .pipe(dest("./build/css"));
}

function javascript(){
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat("bundle.js"))
        .pipe(terser())
        .pipe(sourcemaps.write("."))
        .pipe(rename({ suffix: ".min"}))
        .pipe(dest("./build/js"));
}

function images(){
    return src(paths.images)
        .pipe(imagemin())
        .pipe(dest("./build/img"))
        .pipe(notify({ message: "Image ready"}));
}

function versionWebp() {
    return src(paths.images)
      .pipe(webp())
      .pipe(dest("./build/img"))
      .pipe(notify({ message: "Versión webP ready" }));
  }

function watchFiles(){
    watch(paths.scss, css);
    watch(paths.js, javascript);
}

exports.css = css;
exports.images = images;
exports.watchFiles = watchFiles;

exports.default = series(css, javascript, images, versionWebp, watchFiles);