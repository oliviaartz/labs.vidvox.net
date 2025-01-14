const gulp = require('gulp'),
      sass = require('gulp-sass'),
      ejs = require('gulp-ejs'),
      moveToDirectoryIndex = require('gulp-move-to-directory-indexes'),
      imagemin = require('gulp-imagemin'),
      connect = require('gulp-connect'),
      runSequence = require('run-sequence'),
      sitemap = require('gulp-sitemap')

gulp.task('sass', function () {
  return gulp.src('src/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/styles'))
})

gulp.task('scripts', function() {  
  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('build/scripts'))
})

gulp.task('ejs',function(){  
  return gulp.src([ 'src/views/**/*.ejs',
                    '!src/views/partials/**/*.ejs'])
    .pipe(ejs({},{}, {ext:'.html'}))
    .pipe(moveToDirectoryIndex())
    .pipe(gulp.dest('build/'))
})

gulp.task('images',function(){  
  return gulp.src('src/images/**/*.*')
    .pipe(gulp.dest('build/images/'))
})

gulp.task('images-minified',function(){  
  return gulp.src('src/images/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images/'))
})

gulp.task('webfonts', function () {
  return gulp.src('src/webfonts/*')
    .pipe(gulp.dest('build/styles/webfonts'))
})

gulp.task('embed-svg',function(){  
  return gulp.src('*.html')
    .pipe(embedSvg())
    .pipe(gulp.dest('build/'));
})

gulp.task('videos',function(){  
  return gulp.src('src/videos/**/*.*')
    .pipe(gulp.dest('build/videos/'))
})

gulp.task('redirects',function(){  
  return gulp.src('_redirects')
    .pipe(gulp.dest('build/'))
})

gulp.task('serve', function() {
  connect.server({
    root: 'build',
    livereload: true
  })
})

gulp.task('livereload', function () {
  gulp.src('build/*.html')
    .pipe(gulp.dest('build/'))
    .pipe(connect.reload());
})

gulp.task('move-google-verification', function(){  
  // return gulp.src('google8e356c7d3c1d1496.html')
    // .pipe(gulp.dest('build/'))
})

gulp.task('sitemap', function () {
  gulp.src('build/**/*.html', {
          read: false
      })
      .pipe(sitemap({
          siteUrl: 'https://labs.vidvox.net'
      }))
      .pipe(gulp.dest('./build'))
})

gulp.task('watch', function() {  
    gulp.watch('src/styles/**/*.scss', ['sass'])
    gulp.watch('src/js/**/*.js', ['scripts'])
    gulp.watch('src/views/**/*.ejs', ['ejs'])
    gulp.watch('src/images/**/*.*', ['images'])
    gulp.watch('src/webfonts/**/*.*', ['webfonts'])
    gulp.watch('src/videos/**/*.*', ['videos'])
    gulp.watch(['build/**'], ['livereload']);
})

gulp.task('build', ['sass', 'scripts', 'ejs', 'images', 'webfonts', 'videos', 'sitemap'])

gulp.task('deploy', ['ejs', 'sass', 'scripts', 'images', 'webfonts', 'videos', 'redirects', 'move-google-verification'], function (cb) {
  runSequence(['sitemap'], cb);
})

gulp.task('default', ['build', 'serve', 'watch'])