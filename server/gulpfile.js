const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const tsify = require("tsify");

gulp.task('browserify', function() {

    return browserify('main.ts', {
            // To understand next entries see: https://github.com/substack/node-browserify/issues/1472#issuecomment-212823393
            browserField: false,
            builtins: false,
            commondir: false,
            insertGlobalVars: {
                process: undefined,
                global: undefined,
                'Buffer.isBuffer': undefined,
                Buffer: undefined
            }
        })
        .plugin(tsify)
        .bundle()
        .pipe(source('main.js'))
        //.pipe(buffer())
        .pipe(gulp.dest('dist'))
});


gulp.task('default', ['browserify']);

