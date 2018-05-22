const gulp = require('gulp');
const stylus = require('gulp-stylus');
const pug = require('pug');
const map = require('map-stream');
const rename = require('gulp-rename');
const glob = require('glob');
const fs = require('fs');
const file = require('gulp-file');
const path = require('path');
const webserver = require('gulp-webserver');

gulp.task('webserver', function() {
  gulp.src('./public')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('build', ['admin', 'stylus', 'images', 'categories', 'index']);

gulp.task('index', () => {
  const indexTemplate = pug.compileFile('layouts/index.pug');
  const categories = getCategories();
  categories.map(category => category.url = `/${category.name}`);

  file('index.html', indexTemplate({ categories }), { src: true })
    .pipe(gulp.dest('./public'));
});

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

gulp.task('stylus', () => {
  return gulp.src('static/css/entry.styl')
    .pipe(stylus())
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('images', () => {
  return gulp.src('static/images/**')
    .pipe(gulp.dest('./public/images'));
});

gulp.task('categories', () => {
    const categoryTemplate = pug.compileFile('layouts/category.pug');
    const productTemplate = pug.compileFile('layouts/product.pug');
    const products = getProducts();
    const categories = getCategories();
    categories.map(category => category.url = `/${category.name}`);

    categories.forEach((category) => {
      const categoryDir = `./public/${category.name}`;
      const productsInCategory = products.filter(product => product.category === category.title);
      productsInCategory.map(product => product.url = `/${category.name}/${product.name}.html`);
      category.products = productsInCategory;

      file('index.html', categoryTemplate({ categories, category }), { src: true })
        .pipe(gulp.dest(categoryDir));

      productsInCategory.forEach((product) => {
        file(`${product.name}.html`, productTemplate({ categories, product }), { src: true })
          .pipe(gulp.dest(categoryDir));
      })
    });
});

function getCategories() {
  return glob.sync('_categories/*.json').map(getJsonFromFile);
}

function getProducts() {
  return glob.sync('_products/*.json').map(getJsonFromFile);
}

function getMap() {
  const allProducts = getProducts();
  const allCategories = getCategories();
  const productsByCategory = allCategories.map(category => addProductsToCategory(category, allProducts));

  return allCategories;
}

function addProductsToCategory(category, allProducts) {
  const products = allProducts.filter(product => product.category === category.title).map(product => product.permaLink = `/${category.name}/${product.name}`);
  return Object.assign(category, products);
}

function getJsonFromFile(file) {
  let json = JSON.parse(fs.readFileSync(file));
  json.name = path.parse(file).name;
  return json;
}
