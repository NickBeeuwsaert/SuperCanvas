var gulp   = require("gulp"),
    babel  = require("gulp-babel"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    webpack= require("webpack-stream");

gulp.task('jshint', function(){
    return gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
    return gulp.src([
        "src/SuperCanvas.js"
    ])
    .pipe(webpack({
        output: {
            "library": "SuperCanvas",
            "libraryTarget": "umd",
            "filename": "SuperCanvas.js"
        }
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('compress', function(){
    return gulp.src('dist/SuperCanvas.js')
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['jshint', 'build', 'compress']);
