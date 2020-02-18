let gulp = require('gulp');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify-es').default;
let csso = require('gulp-csso');
let rename = require('gulp-rename');
const babel = require('gulp-babel');

var css = {
	src: 'assets/css/src/**/*.scss',
	dest: 'assets/css/dist',
	filename: 'style.scss'
};

var js = {
	src: 'assets/js/src/**/*.js',
	dest: 'assets/js/dist',
	filename: 'tabbis.js'
};

function style() {
	return (
		gulp
			.src(css.src)
			//.pipe(concat(css.filename))
			.pipe(sass())
			.on('error', sass.logError)
			.pipe(autoprefixer())
			.pipe(gulp.dest(css.dest))
			.pipe(csso())
			.pipe(rename({ extname: '.min.css' }))
			.pipe(gulp.dest(css.dest))
	);
}

function script() {
	return gulp
		.src(js.src)
		.pipe(concat(js.filename))
		.pipe(rename({ extname: '.es6.js' }))
		.pipe(gulp.dest(js.dest))
		.pipe(uglify())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest(js.dest));
}

function tobabel() {
	return gulp
		.src(js.src)
		.pipe(concat(js.filename))
		.pipe(rename({ extname: '.es5.js' }))
		.pipe(
			babel({
				presets: [ '@babel/env' ]
			})
		)
		.pipe(gulp.dest(js.dest))
		.pipe(uglify())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest(js.dest));
}

function watch() {
	gulp.watch(css.src, style);
	gulp.watch(js.src, script);
	gulp.watch(js.src, tobabel);
}

exports.css = style;
exports.js = script;
exports.default = watch;
