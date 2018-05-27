'use strict';

var gulp          = require('gulp'),
    watch         = require('gulp-watch'),
    plumber       = require('gulp-plumber'),
    prefixer      = require('gulp-autoprefixer'),
    uglify        = require('gulp-uglify'),
    sass          = require('gulp-sass'),
    rigger        = require('gulp-rigger'),
    pug           = require('gulp-pug'),
    imagemin      = require('gulp-imagemin'),
    rimraf        = require('rimraf'),
    browserSync   = require("browser-sync"),
    reload        = browserSync.reload;

var path = {
    build: {
      html: 'build/',
      css: 'build/css',
      img: 'build/image',
      fonts: 'build/fonts'
    },
    src: {
      html: 'src/*.pug',
      style: 'src/style/stl_style.sass',
      img: 'src/image/**/*.*',
      fonts: 'src/fonts/**/*.*'
    },
    watch: {
      html: 'src/**/*.pug',
      style: 'src/style/**/*.sass',
      img: 'src/image/**/*.*',
      fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
      baseDir: "./build"
    },
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

//jade build task
gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

//stylus build task
gulp.task('style:build', function () {
  gulp.src(path.src.style)
    .pipe(plumber())
    .pipe(sass())
    .pipe(prefixer()) 
    .pipe(gulp.dest(path.build.css)) 
    .pipe(reload({stream: true}));
});

//images build task
gulp.task('image:build', function () {
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true
      }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

//fonts build task
gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

//build steps
gulp.task('build', [
  'html:build',
  'style:build',
  'fonts:build',
  'image:build'
]);

//wath
gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
});

gulp.task('webserver', function () {
  browserSync(config);
});

//default gulp task
gulp.task('default', ['build', 'webserver', 'watch']);
