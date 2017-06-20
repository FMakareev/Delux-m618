var gulp = require('gulp'),
    // browserSync = require('browser-sync').create(),
    include = require('gulp-file-include'),
    smaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    debug = require('gulp-debug'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat');

var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var path_build = {
    "build" : "build",
    "html" : "build/html",
    "img" : "build/img",
    "js" : "build/js",
    "css" : "build/css/",
    "fonts" : "build/fonts/"
};
var path_src = {
    "src" : "src/",
    "html" : 'src/**/*.html',
    "img" : "src/img/**/*.*",
    "js" : "src/**/*.js",
    "scss" : "src/**/*.scss",
    "fonts" : "src/fonts/**/*.*",
    "watch" : "src/**/*.*"
};
var bower = {
    "jquery": "bower_components/jquery/dist/jquery.min.js",
    "bootstrap" : {
        "css" : "bower_components/bootstrap/dist/css/bootstrap.css",
        "js" : "bower_components/bootstrap/js/"
    },
    "fontawsome" : "",
    "glyphicons" : {
        "fonts" : "bower_components/glyphicons/_fonts.scss/*.*",
        "style" : "bower_components/glyphicons/styles/*.css"
    }
};
// Удоление дирректории со сборкой
gulp.task('clean', function() {
    return del(path_build.build);
});
// сборка основых html файлов
gulp.task('html:all', function() {
    return gulp.src(path_src.html)
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'html:all',
                    message: err.message
                }
            })
        }))
        .pipe(include())
        .pipe(debug({ title: 'html:' }))
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(path_build.build))
        .pipe(reload({stream:true}));
});

gulp.task('sass', function () {
    return gulp.src(path_src.scss)
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Sass',
                    message: err.message
                }
            })
        }))
        .pipe(smaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(smaps.write("./"))
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(path_build.css))
        .pipe(reload({stream:true}));
});

gulp.task('js', function () {
    return gulp.src(path_src.js)
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Javascript',
                    message: err.message
                }
            })
        }))
        .pipe(smaps.init())
        .pipe(smaps.write("./"))
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest(path_build.js));
});

gulp.task('img', function () {
    return gulp.src(path_src.img)
        .pipe(gulp.dest(path_build.img));
})

gulp.task('fonts', function () {
    return gulp.src(path_src.fonts)
        .pipe(gulp.dest(path_build.fonts));
})

gulp.task('vendor:css', function () {
    return gulp.src([bower.glyphicons.style,bower.bootstrap.css])
        .pipe(concat('vendor.css'))
        .pipe(cssnano())
        .pipe(rename('vendor.min.css'))
        .pipe(gulp.dest(path_build.css));
});

gulp.task('vendor:_fonts.scss', function () {
    return gulp.src([bower.glyphicons.fonts])
        .pipe(gulp.dest(path_build.fonts));
});

gulp.task('vendor:js', function () {
    return gulp.src([bower.jquery,
        bower.bootstrap.js + 'dropdown.js',
        bower.bootstrap.js + 'collapse.js',
        bower.bootstrap.js + 'button.js',
        bower.bootstrap.js + 'tab.js',
        bower.bootstrap.js + 'modal.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(rename('vendor.min.js'))
        .pipe(gulp.dest(path_build.js));
});

gulp.task('vendor:all', gulp.series('vendor:css','vendor:_fonts.scss','vendor:js'));

gulp.task('watch', function () {
    gulp.watch(path_src.scss, gulp.series('sass'));
    gulp.watch(path_src.html, gulp.series('html:all'));
    gulp.watch(path_src.img, gulp.series('img'));
    gulp.watch(path_src.fonts, gulp.series('fonts'));
    gulp.watch(path_src.js, gulp.series('js'));
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "./"+path_build.build,
            index: "guarantee.html"
        },
        port: 8080,
        open: true,
        notify: false
    });
});


// gulp.task('server', function () {
//     browserSync.init({
//         server: "./"+path_build.build,
//         index: "ui-kit.html"
//     });
//     browserSync.watch(path_src.watch).on('change', browserSync.reload);
// });

gulp.task('build', gulp.series('clean','sass',gulp.parallel('img','fonts'),'js','html:all'));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'browserSync')));