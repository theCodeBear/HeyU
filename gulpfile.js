var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sh = require('shelljs'),
    babel = require('gulp-babel'),
    jshint = require('gulp-jshint'),
    copy = require('gulp-copy'),
    del = require('del'),
    inject = require('gulp-inject'),
    uglify = require('gulp-uglify');

var paths = {
  sass: ['./src/scss/**/*.scss'],
  js: ['./src/**/*.js', '!./src/lib/**/*.js'],
  html: ['./src/**/*.html'],
  all: ['./src/scss/**/*.scss', './src/**/*.js', './src/**/*.html']
};




// DEVELOPMENT

gulp.task('default', ['inject']);

gulp.task('sass', ['copy-lib', 'clean-css'], function(done) {
  gulp.src(paths.sass)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('jshint', ['babel'], function() {
  gulp.src(['./www/**/*.js', '!./www/lib', '!./www/lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('babel', ['clean-js'], function() {
  gulp.src(paths.js)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./www'));
});

gulp.task('copyHtmlImg', ['clean-html'], function() {
  return gulp.src(['./src/**/*.html', './src/img', './src/img/**/*'])
    .pipe(copy('./www', { prefix: 1 }));
});

gulp.task('clean-js', function(cb) {
  del(['./www/**/*.js', '!./www/lib', '!./www/lib/**/*.js']).then(function(delPaths) {
    console.log('Deleted js files and folders:\n', delPaths.join('\n'), '\n');
    cb();
  });
});

gulp.task('clean-html', function(cb) {
  del(['./www/**/*.html', '!./www/lib', '!./www/lib/**/*.html']).then(function(delPaths) {
    console.log('Deleted html files and folders:\n', delPaths.join('\n'), '\n');
    cb();
  });
});

gulp.task('clean-css', function(cb) {
  del(['./www/css/**/*.css', '!./www/css']).then(function(delPaths) {
    console.log('Deleted css files and folders:\n', delPaths.join('\n'), '\n');
    cb();
  });
});

gulp.task('copy-lib', ['remove-lib'], function() {
  return gulp.src(['./src/lib', './src/lib/**/*'])
    .pipe(copy('./www', { prefix: 1 }));
});

gulp.task('remove-lib', function(cb) {
  del(['./www/lib', './www/lib/**/*']).then(function(delPaths) {
    console.log('Library files have been removed from www directory.');
    cb();
  });
});

gulp.task('inject', ['sass', 'jshint', 'copyHtmlImg'], function() {
  return gulp.src('./www/index.html')
    .pipe(inject(
      gulp.src([//'./www/**/*.js', '!./www/lib/**/*.js',
        './www/css/**/*.css'], {read: false}),
      {relative: true}
    ))
    .pipe(gulp.dest('./www'));
});

gulp.task('watch', ['inject'], function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['jshint']);
  gulp.watch(paths.html, ['copyHtmlImg']);
  gulp.watch(paths.all, ['inject']);
});




// PRODUCTION

// a mobile app cares about space but not about loading time, so I want to
// minify CSS and JS but I don't care how about files It needs to load so
// I don't need to concatenate files.
// So, do all stuff that dev does but also minify CSS and minify all JS


gulp.task('production', ['inject-prod']);

gulp.task('sass-prod', ['copy-lib', 'clean-css'], function(done) {
  gulp.src('./src/scss/**/*.scss')
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'expanded'
    }))
    .pipe(gulp.dest('./www/tempCss/'))
    .on('end', done);
});

gulp.task('minify-concat-css', ['sass-prod'], function(done) {
  gulp.src('./www/tempCss/*')
    .pipe(concat('styles.css'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('delete-tempCss', ['minify-concat-css'], function(cb) {
  del(['./www/tempCss']).then(function(delPaths) {
    console.log('Deleted', delPaths);
    cb();
  });
});

gulp.task('inject-prod', ['delete-tempCss', 'jshint-prod', 'copyHtmlImg'], function() {
  return gulp.src('./www/index.html')
    .pipe(inject(
      gulp.src([//'./www/**/*.js', '!./www/lib/**/*.js',
        './www/css/**/*.css'], {read: false}),
      {relative: true}
    ))
    .pipe(gulp.dest('./www'));
});

gulp.task('jshint-prod', ['babel-prod'], function() {
  gulp.src(['./www/**/*.js', '!./www/lib', '!./www/lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('babel-prod', ['clean-js'], function() {
  gulp.src(paths.js)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./www'));
});



