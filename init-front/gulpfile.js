var gulp = require('gulp'),
    Promise = require('es6-promise').Promise, //autoprefixer插件需要，缺少会报错not difine promise
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    //imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify');

var browserSync = require('browser-sync'); //引入模块 参考链接：https://www.browserSync.io/docs/gulp/,https://segmentfault.com/a/1190000003787713

var dist = __dirname + '/dist';
var timetemp = new Date().getTime();
var url = '',
    res = '';

gulp.task('sass', function() {

    return gulp.src('css/styles/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest("css"))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('css'))
        .pipe(notify({
            message: 'Sass task complete'
        }));
});

// gulp.task('scripts', function() {
//     return gulp.src(['resources/js/**/*.js','! resources/js/lib/*.js'])
//         .pipe(jshint('.jshintrc'))
//         .pipe(jshint.reporter('default'))
//         .pipe(notify({
//             message: 'Scripts task complete'
//         }));
// });



// gulp.task('images', function() {
//     return gulp.src('src/Images/**')
//         //.pipe(gulp.dest(dist+'/Images'))
//         .pipe(imagemin({
//             optimizationLevel: 3,
//             progressive: true,
//             interlaced: true
//         }))
//         .pipe(gulp.dest(dist + '/Images'))
//         // .pipe(notify({
//         //     message: 'Images task complete'
//         // }));
// });



gulp.task('watch', function() {
    gulp.watch('css/styles/**/*.scss', ['sass'], browserSync.reload);
    // gulp.watch('resources/js/*.js', ['scripts'],browserSync.reload);

    // 建立即时重整伺服器
    //var server = livereload();
    //http://feedback.livereload.com/knowledgebase/articles/86180-how-do-i-add-the-script-tag-manually-

});


gulp.task('server', function() {
    browserSync({ //调用API
        files: "**", //监听整个项目
        server: {
            baseDir: "./" //监听当前路径
        }
    });
    gulp.start('watch')
});

gulp.task('default', function() {
    gulp.start('sass', 'server');
});
