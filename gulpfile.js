'use strict';

var gulp = require("gulp");
var del = require("del");

gulp.task("clean", function () {
  return del("build");
})

gulp.task("build", function (done) {
  run("clean")
})
