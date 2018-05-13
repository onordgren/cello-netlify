const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');

gulp.task('build', ['admin', 'pug', 'sass']);

gulp.task('admin', () => {
  return gulp.src('src/admin/*')
    .pipe(gulp.dest('./public/admin'));
});

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
