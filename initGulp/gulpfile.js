// 载入外挂
var gulp = require('gulp'),
    Promise = require('es6-promise').Promise; //autoprefixer插件需要，缺少会报错not difine promise
sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');
    inject = require('gulp-inject');
// cssnano = require('gulp-cssnano'),

gulp.task('inject', function() {
    var target = gulp.src('Janssen/Information.html');
    var sources = gulp.src(['./dist/**/*.min.js', './dist/**/*.min.css'], {
        read: false
    });

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./Janssen'));
})

// 样式
gulp.task('sass', function() {
    return sass('Janssen/dev/Styles/sass/*.scss', {
            style: 'expanded'
        })
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({
            message: 'Sass task complete'
        }));
});

// 脚本
gulp.task('scripts', function() {
    return gulp.src('Janssen/dev/scripts/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// 图片
gulp.task('images', function() {
    return gulp.src('Janssen/Images/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({
            message: 'Images task complete'
        }));
});

// 清理
gulp.task('clean', function() {
    // return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {
    return gulp.src(['dist/*'], {
            read: false
        })
        .pipe(clean());
});

// 预设任务
gulp.task('default', ['clean'], function() {
    //gulp.start('styles', 'scripts', 'images');
    gulp.start('sass', 'scripts', 'images');
});

// 看手
gulp.task('watch', function() {

    // 看守所有.scss档
    gulp.watch('src/styles/**/*.scss', ['sass']);

    // // 看守所有.js档
    gulp.watch('Janssen/dev/scripts/*.js', ['scripts']);

    // 看守所有图片档
    gulp.watch('Janssen/images/*', ['images']);

    // 建立即时重整伺服器
    var server = livereload();

    // 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
    gulp.watch(['dist/**']).on('change', function(file) {
        server.changed(file.path);
    });

});