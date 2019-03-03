var syntax = "scss"; // Syntax: sass or scss;

var gulp = require("gulp"),
  gutil = require("gulp-util"),
  sass = require("gulp-sass"),
  browsersync = require("browser-sync"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  cleancss = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  autoprefixer = require("gulp-autoprefixer"),
  notify = require("gulp-notify");

gulp.task("browser-sync", function() {
  browsersync({
    server: {
      baseDir: "_site"
    },
    notify: false
    // open: false,
    // tunnel: true,
    // tunnel: "projectname", //Demonstration page: http://projectname.localtunnel.me
  });
});

gulp.task("styles", function() {
  return gulp
    .src(syntax + "/**/*." + syntax + "")
    .pipe(sass({ outputStyle: "expand" }).on("error", notify.onError()))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest("css"))
    .pipe(gulp.dest("_site/css"))
    .pipe(browsersync.reload({ stream: true }));
});

gulp.task("js", function() {
  return (
    gulp
      .src([
        "libs/jquery.min.js",
        "libs/likely.js",
        "libs/prognroll.js",
        "js/index.js" // Always at the end
      ])
      .pipe(concat("scripts.min.js"))
      // .pipe(uglify()) // Minifify js (optional)
      .pipe(gulp.dest("js"))
      .pipe(gulp.dest("_site/js"))
      .pipe(browsersync.reload({ stream: true }))
  );
});

gulp.task("watch", ["styles", "js", "browser-sync"], function() {
  gulp.watch(syntax + "/**/*." + syntax + "", ["styles"]);
  gulp.watch(["libs/**/*.js", "js/index.js"], ["js"]);
  gulp.watch("_site/**/*.html", browsersync.reload);
});

gulp.task("default", ["watch"]);
