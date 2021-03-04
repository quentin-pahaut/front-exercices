const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');

const imagemin = require("gulp-imagemin");

const browsersync = require("browser-sync").create();

const styles = () => {
	return gulp.src( './src/sass/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(postcss([
		autoprefixer({ overrideBrowserslist: ['last 2 versions', 'ie >= 9'] }),
		cssnano()
	]))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest( './dist/css/'))
	.pipe(browsersync.stream());
}

const javascript = () => {
	return gulp.src('./src/js/**/*.js')
	  .pipe(sourcemaps.init())
	  .pipe(eslint())
	  .pipe(babel())
	  .pipe(concat('main.min.js'))
	  .pipe(uglify())
	  .pipe(sourcemaps.write('./'))
	  .pipe(gulp.dest( './dist/js/'))
	  .pipe(browsersync.stream());
}

const browserSync = (done) => {
	browsersync.init({
		server: {
		  baseDir: "./"
		},
		port: 3000
	  });
	  done();
}

const reloadBrowerSync = (done) => {
	browsersync.reload();
	done();
}

const watchFiles = () => {
	gulp.watch("./src/sass/**/*.scss", styles);
	gulp.watch("./src/js/**/*.js", javascript);
	gulp.watch("./*.html", reloadBrowerSync);
}

const compressImages = () => {
	return gulp.src([
		 './src/images/**/*',
		 './src/img/**/*'
	  ])
	 .pipe(imagemin({
		 progressive: true,
		 svgoPlugins: [{removeViewBox: false}]
	 }))
	 .pipe(gulp.dest('./dist/images/'))
}

const build = gulp.series(styles, javascript, compressImages);
const watch = gulp.parallel(watchFiles, browserSync);
const compress = gulp.series(compressImages);

exports.watch = watch;
exports.compress = compress;

exports.default = build;