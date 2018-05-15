const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('pug');
const map = require('map-stream');
const rename = require('gulp-rename');
const glob = require('glob');
const fs = require('fs');
const file = require('gulp-file');
const path = require('path');

gulp.task('build', ['admin', 'sass', 'images', 'categories']);

gulp.task('admin', () => {
  return gulp.src('static/admin/*')
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
  return gulp.src('static/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('images', () => {
  return gulp.src('static/images/**')
    .pipe(gulp.dest('./public/images'));
});

gulp.task('categories', () => {
    const categoryTemplate = pug.compileFile('layouts/category.pug');
    const productTemplate = pug.compileFile('layouts/product.pug');
    const products = glob.sync('_products/*.json').map(getJsonFromFile);
    const categories = glob.sync('_categories/*.json').map(getJsonFromFile);

    categories.forEach((category) => {
      const categoryDir = `./public/${category.name}`;
      const productsInCategory = products.filter(product => product.category === category.title);
      productsInCategory.map(product => product.permaLink = `/${category.name}/${product.name}.html`);
      category.products = productsInCategory;

      file('index.html', categoryTemplate(category), { src: true })
        .pipe(gulp.dest(categoryDir));

      productsInCategory.forEach((product) => {
        file(`${product.name}.html`, productTemplate(product), { src: true })
          .pipe(gulp.dest(categoryDir));
      })
    });
});

function getJsonFromFile(file) {
  let json = JSON.parse(fs.readFileSync(file));
  json.name = path.parse(file).name;
  return json;
}
