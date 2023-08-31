const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));

function buildStyles() {
  return src("sass/style.scss").pipe(sass()).pipe(dest("css"));
}

function watchTask() {
  watch(["sass/style.scss"], buildStyles);
}

exports.default = series(buildStyles, watchTask);
