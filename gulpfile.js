let gulp = require("gulp");
let concat = require("gulp-concat");
let uglify = require("gulp-uglify-es").default;
let rename = require("gulp-rename");

var js = {
  src: "assets/js/src/**/*.js",
  dest: "assets/js/dist",
  filename: "tabbis.js"
};

function script() {
  return gulp
    .src(js.src)
    .pipe(concat(js.filename))
    .pipe(gulp.dest(js.dest))
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulp.dest(js.dest));
}

function watch() {
  gulp.watch(js.src, script);
}

exports.js = script;
exports.default = watch;
