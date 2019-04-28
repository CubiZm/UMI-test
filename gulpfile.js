"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var sass = require("gulp-sass");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var rename = require("gulp-rename");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var del = require("del");
var flatten = require('gulp-flatten');

var config = {
  dest: 'build/',
  src: 'src/assets/',
  root: 'src/'
};

var path = {
  build: {
    html: 'src/',
    img: config.dest + "images/",
    styles: config.dest + "css/",
    js: config.dest + "js/",
    icons: config.dest + "images/icons/",
    favicons: config.dest + "images/favicons/"
  },
  src: {
    html: config.root + "markup/*.*",
    img: config.src + "images/*",
    styles: config.src + "scss/**/*.scss",
    sass: config.src + "scss/style.scss",
    js: config.root + "js/*.js",
    icons: config.src + "images/icons/*.{png,svg}",
    favicons: config.src + "images/favicons/*.png",
    fonts: config.src + "fonts/**/*.{woff,woff2}"
  }
};

gulp.task("style", function() {
  gulp.src(path.src.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          "last 3 version",
          "last 2 Chrome versions",
          "last 2 Firefox versions",
          "last 2 Opera versions",
          "last 2 Edge versions",
          "IE 11"
        ]
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest(path.build.styles))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(path.build.styles))
    .pipe(server.reload({ stream: true }));
});

gulp.task("images-min", function() {
  return gulp.src(path.build.img + "*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true })
    ]))
    .pipe(gulp.dest(path.build.img));
});

gulp.task("symbols", function() {
  return gulp.src(path.build.icons + "*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest(path.build.img));
});

gulp.task("serve", function() {
  server.init({
    server: "build",
    notify: false,
    open: true,
    ui: false
  });
  gulp.watch(path.src.styles, ["style"]).on("change", server.reload);
  gulp.watch(path.src.html, ["copy-html"]).on("change", server.reload);
});

gulp.task("copy", function() {
  return gulp.src([
      path.src.fonts,
      path.src.img,
      path.src.js
    ], {
      base: "."
    })
    .pipe(flatten({ includeParents: -1 }))
    .pipe(gulp.dest(config.dest));
});

gulp.task("copy-html", function() {
  return gulp.src([
      path.src.html
    ], {
      base: "."
    })
    .pipe(flatten())
    .pipe(gulp.dest(config.dest));
});

gulp.task("copy-icons", function() {
  return gulp.src([
      path.src.icons
    ], {
      base: "."
    })
    .pipe(flatten())
    .pipe(gulp.dest(path.build.icons));
});

gulp.task("copy-favicons", function() {
  return gulp.src([
      path.src.favicons
    ], {
      base: "."
    })
    .pipe(flatten())
    .pipe(gulp.dest(path.build.favicons));
});

gulp.task("clean", function() {
  return del(config.dest);
});

gulp.task("build", function(fn) {
  run("clean", "copy", "copy-html", "copy-icons", "copy-favicons", "style", "images-min", "symbols", "serve", fn);
});
