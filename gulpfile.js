// declare the gulp dependency
const gulp = require('gulp');

// Set up js-hint
const jshint = require('gulp-jshint');

// Our task
gulp.task('jshint', () => {
    // run the gulp task on our script
    return gulp.src('js/script.js')
        // telling gulp that we're using es6
        // pipe is like a .then, it runs something after something 
        .pipe(jshint({ "esversion": 6 }))
        //plug in the styles we downloaded from NPM (stylish reporter)
        .pipe(jshint.reporter('jshint-stylish'))
})

// Our new task
// Sass - lint
const sassLint = require('gulp-sass-lint');

gulp.task('sass-lint', () => {
    // plugin the css folder and then leave two trailing asterixs
    // two astrixs are known as wildcards
    // two asterixes indicates a directory
    return gulp.src('css/**/*.scss')
        // run sass lint
        .pipe(sassLint())
        // tell sass lint to format your sass
        .pipe(sassLint.format())
        // tells sass lint to stop if there's an error
        .pipe(sassLint.failOnError())
})

// Set up a watch task. Watching our files on save, will automatically run our tasks

const { watch } = require('gulp');

// set up watch task
gulp.task('watch', () => {
    gulp.watch('js/*.js', gulp.series('jshint')),
        gulp.watch('css/**/*.scss', gulp.series('sass-lint'));
}) 