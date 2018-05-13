const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');


gulp.task('build', ['pug', 'sass']);


gulp.task('pug', () => {
  return gulp.src('src/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./public'));
});


gulp.task('sass', () => {
  return gulp.src('src/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public'));
});
