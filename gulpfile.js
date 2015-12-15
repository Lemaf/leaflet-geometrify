var gulp = require('gulp');

function readJson(fileName) {
	var fs = require('fs');

	return JSON.parse(fs.readFileSync(fileName, {encoding: 'utf8'}));
}

gulp.task('lint:javascript', function () {
	var jshint = require('gulp-jshint');

	return gulp.src('src/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default', {verbose: true}))
		.pipe(jshint.reporter('fail'));
});

gulp.task('concat:javascript', ['lint:javascript'], function () {
	var concat = require('gulp-concat'),
	    resolveDeps = require('gulp-resolve-dependencies'),
	    sourceMap = require('gulp-sourcemaps');

	return gulp.src(readJson('sources.json').js, {cwd: 'src'})
		.pipe(resolveDeps())
		.pipe(sourceMap.init())
		.pipe(concat('l.geometrify.js', {newLine: '\n\n'}))
		.pipe(sourceMap.write('./'))
		.pipe(gulp.dest('dist/'));
});

gulp.task('uglify:javascript', ['concat:javascript'], function () {

	var uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

	return gulp.src('dist/l.geometrify.js')
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(gulp.dest('dist/'));

});

gulp.task('test:mocha', ['lint:javascript'], function () {

	var mocha = require('gulp-mocha');

	return gulp.src('test/*.js')
		.pipe(mocha({
			reporter: 'spec',
			require: [
				'./common.js',
				'./src/L.geometrify.js',
				'./src/L.geometrify.Point.js',
				'./src/L.geometrify.intersection.js'
			]
		}));
});