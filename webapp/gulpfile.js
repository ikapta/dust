var gulp = require('gulp'),
    Promise = require('es6-promise').Promise, //autoprefixer插件需要，缺少会报错not difine promise
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    //imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync');

var dist = __dirname + '/dist';
var timetemp = new Date().getTime();

gulp.task('sass', function() {

    return gulp.src('pages/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('pages/'))
        .pipe(notify({
            message: 'Sass task complete'
        }));
});


gulp.task('watch', function() {
    gulp.watch('pages/**/*.scss', ['sass'], browserSync.reload);
});


gulp.task('server', function() {
    browserSync({ 
        files: "**", //监听整个项目
        server: {
            baseDir: "../" 
        }
    });
    gulp.start('watch');
});

gulp.task('default', function() {
    gulp.start('sass', 'server');
});