var typescript = require('typescript');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var mocha = require('gulp-mocha');

var PATHS = {
	src: {
		ts: 'src/**/*.ts'
	},
	dest: {
		dist: 'dist'
	}
};

gulp.task('typescript', function(){
	return gulp.src(PATHS.src.ts).pipe(ts({
		typescript: typescript,
		target: 'ES5',
		module: 'commonjs'
	})).js.pipe(gulp.dest(PATHS.dest.dist));
});

gulp.task('test', ['typescript'], function () {
    return gulp.src('tests/basic.js')
        .pipe(mocha())
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});

gulp.task('build', ['test'], function(){
	
});