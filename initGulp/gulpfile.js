// 载入外挂
var gulp = require('gulp'),
    //series = require('stream-series'),  

    Promise = require('es6-promise').Promise, //autoprefixer插件需要，缺少会报错not difine promise
    //sass = require('gulp-ruby-sass'), 性能不好
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    notify = require('gulp-notify');

var dist = __dirname + '/dist';
var timetemp = new Date().getTime();
var url = '',
    res = '';
    
    //复制静态文件
gulp.task('staticfile', function() {
   return gulp.src('src/lib/**').pipe(gulp.dest(dist + "/lib/"));
})
    
    // 样式sass编译
gulp.task('sass', function() {

    return gulp.src('src/dev/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(dist + "/dev"))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(sourcemaps.write(dist + "/dev"))
        .pipe(gulp.dest(dist + "/dev"))
        .pipe(notify({
            message: 'Sass task complete'
        }));
});

// 脚本
gulp.task('scripts', function() {
    return gulp.src('src/dev/scripts/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('jsn_main.js'))
        .pipe(gulp.dest(dist + "/dev/scripts"))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dist + "/dev/scripts"))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});
    
 //文件注入,由于注入的前提是需要其他文件准备完成，所以流的执行需要依赖其他的方法执行完成 ，而且其他的方法必须要 写 return 返回流  
gulp.task('inject',['staticfile','sass','scripts'], function() {
    var target = gulp.src('src/**/*.html');
    var headerTpl = gulp.src(['src/html_tpl/_header.tpl.html']);

    var lib_cssJs = gulp.src(['dist/**/jquery.min.js', 'dist/**/bootstrap.min.js', 'dist/**/bootstrap.min.css', 'dist/**/font-awesome.min.css'], {
        read: false
    });
    var dev_Js = gulp.src(['dist/dev/**/*.min.js'], {
        read: false
    });
    var dev_css = gulp.src(['dist/dev/**/*.min.css'], {
        read: false
    });

    target

    //inject header
        .pipe(inject(headerTpl, {
        starttag: '<!-- inject:header:{{ext}} -->',
        transform: function(filePath, file) {
            //console.log(filePath);
            return file.contents.toString('utf8')
        }
    }))

    //inject lib cssjs
    .pipe(inject(lib_cssJs, {
        starttag: '<!-- inject:headlib:{{ext}} -->',
        transform: function(filePath, file) {
            url = '..' + filePath.replace('/dist', '');
            if (url.indexOf('.css') >= 0) {
                res = '<link rel="stylesheet" href="' + url + '">';
            } else {
                res = '<script src="' + url + '"></script>';
            }
            return res;
        }
    }))

    //inject dev cssjs
    .pipe(inject(dev_Js, {
            starttag: '<!-- inject:headdev:{{ext}} -->',
            transform: function(filePath, file) {
                url = '..' + filePath.replace('/dist', '');
                res = '<script src="' + url+'?v='+timetemp + '"></script>';
                return res;
            }
        }))
        .pipe(inject(dev_css, {
            starttag: '<!-- inject:headdev:{{ext}} -->',
            transform: function(filePath, file) {
                url = '..' + filePath.replace('/dist', '');
                res = '<link rel="stylesheet" href="' + url+'?v='+timetemp + '">';
                return res;
            }
        }))

    .pipe(gulp.dest(dist));

});



// 图片
gulp.task('images', function() {
    return gulp.src('src/Images/**')
        //.pipe(gulp.dest(dist+'/Images'))
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(dist + '/Images'))
        // .pipe(notify({
        //     message: 'Images task complete'
        // }));
});



// 清理
gulp.task('clean', function() {
    // return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {
    return gulp.src(['dist/*'], {
            read: false
        })
        .pipe(clean());
});

// 预设任务，预先执行clean方法
gulp.task('default', ['clean'], function() {
    gulp.start('staticfile', 'scripts', 'images', 'sass', 'inject','watch');
});

// 看手
gulp.task('watch', function() {

    // 看守所有.scss档
    gulp.watch('src/dev/**/*.scss', ['sass']);

    // // 看守所有.js档
    gulp.watch('src/dev/scripts/*.js', ['scripts']);

    // 看守所有图片档
    gulp.watch('src/images/*', ['images']);

    //看守所有的静态文件
    gulp.watch('  src/lib/*', ['staticfile']);
    
    // 建立即时重整伺服器
    //var server = livereload();
    //http://feedback.livereload.com/knowledgebase/articles/86180-how-do-i-add-the-script-tag-manually-

    // 看守所有位在 src/  目录下的档案，一旦有更动，便进行重整
    gulp.watch(['src/**/*.html']).on('change', function(file) {
        gulp.start('inject');
        //server.changed(file.path);
    });

});