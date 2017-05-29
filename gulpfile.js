'use strict';

const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const concat = require('gulp-concat');
const open = require('gulp-open');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const mochaPhantomJS = require('gulp-mocha-phantomjs');
const DIST = './dist/';

gulp.task('default', [
  'fonts',
  'css',
  'babelify',
  'variables',
  'minify-css'
]);

/**
 * Styles
 */

gulp.task('css', () => {
  return gulp.src([
    './node_modules/font-awesome/css/font-awesome.min.css', // ICONS
    './node_modules/roboto-fontface/css/roboto/roboto-fontface.css', // FONT (Roboto)
    './node_modules/prismjs/themes/prism-coy.css', // prismjs coy theme (syntax highlighting)
    './node_modules/flexboxgrid/dist/flexboxgrid.min.css', // flexbox grid system
    './src/less/**/*.less'
  ])
    .pipe(less())
    .pipe(concat('cauldron.css'))
    .pipe(gulp.dest(path.join(DIST, 'css')));
});

/**
 * Minify `cauldron.css`
 */

gulp.task('minify-css', ['css'], () => {
  return gulp.src(path.join(DIST, 'css', 'cauldron.css'))
    .pipe(cleanCSS())
    .pipe(rename('cauldron.min.css'))
    .pipe(gulp.dest(path.join(DIST, 'css')));
});


/**
 * Variables
 * (to be included in the release)
 */

gulp.task('variables', () => {
  return gulp.src(['./src/less/variables.less'])
    .pipe(gulp.dest(path.join(DIST, 'less')));
});

/**
 * Scripts
 */

gulp.task('js', () => {
  return browserify('./index.js')
    .bundle()
    .pipe(source('cauldron.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});


gulp.task('babelify', ['js'], () => {
  return gulp.src('./dist/cauldron.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

/**
 * Minify cauldron.js
 */

gulp.task('minify-js', ['babelify'], () => {
  return gulp.src(path.join(DIST, 'js', 'cauldron.js'))
    .pipe(uglify())
    .pipe(rename('cauldron.min.js'))
    .pipe(gulp.dest(path.join(DIST, 'js')));
});

/**
 * Fonts
 */

gulp.task('fonts', ['icons', 'roboto']);

gulp.task('icons', () => {
  return gulp.src('./node_modules/font-awesome/fonts/**/*')
    .pipe(gulp.dest(path.join(DIST, '/fonts/')));
});

gulp.task('roboto', () => {
  return gulp.src('./node_modules/roboto-fontface/fonts/Roboto/**/*')
    .pipe(gulp.dest(path.join(DIST, '/fonts/Roboto/')));
});

/**
 * Watcher
 */

gulp.task('watch', () => {
  gulp.watch(['./src/less/**/*.less'], ['css']);
  gulp.watch(['./lib/**/*.js', './index.js'], ['js']);
  gulp.watch(['./src/less/variables.less'], ['variables']);
});

/**
 * Test runner
 */

gulp.task('test', ['default'], () => {
  gulp
    .src('test/runner.html')
    .pipe(mochaPhantomJS({
      reporter: 'nyan',
      phantomjs: {
        viewportSize: {
          width: 965,
          height: 700
        },
        useColors: true
      }
    }));
});
