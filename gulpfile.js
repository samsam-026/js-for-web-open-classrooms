const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();

gulp.task('processHTML', () => {
    gulp.src('*.html')
        .pipe(gulp.dest('dist'));
});
gulp.task('processImages', () => {
    gulp.src('images/**.svg')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('processJS', () => {
    gulp.src('*.js')
        .pipe(jshint({
            esversion: 8
        }))
        .pipe(jshint.reporter('default'))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('babelPolyfill', () => {
    gulp.src('node_modules/babel-polyfill/browser.js')
        .pipe(gulp.dest('dist/node_modules/babel-polyfill'));
});

gulp.task('browserSync', () => {
    browserSync.init({
        server: './dist',
        port: 8080,
        ui: {
            port: 8081
        }
    });
});

gulp.task('watch', ['browserSync'], () => {
    gulp.watch('*.js', ['processJS']);
    gulp.watch('*.html', ['processHTML']);

    gulp.watch('dist/*.js', browserSync.reload);
    gulp.watch('dist/*.html', browserSync.reload);
});

gulp.task('default', (callback) => {
    runSequence(['processHTML', 'processImages', 'processJS', 'babelPolyfill'], 'watch', callback);
});