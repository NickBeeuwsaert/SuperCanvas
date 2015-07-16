var gulp = require("gulp"),
    babel = require("gulp-babel"),
    jshint = require("gulp-jshint"),
    wrap = require("gulp-wrap"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename");

gulp.task('jshint', function(){
    return gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
    return gulp.src([
        'src/SuperCanvas.js',
        'src/Path.js',
        'src/Matrix.js'
    ])
    .pipe(concat('SuperCanvas.js'))
    .pipe(wrap({'src': 'dist/template.js'}))
    .pipe(gulp.dest('dist/'));
        
});

gulp.task('compress', function(){
    return gulp.src('dist/SuperCanvas.js')
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['jshint', 'build', 'compress']);
