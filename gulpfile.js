var gulp = require('gulp'),
  gulpWebpack = require('gulp-webpack'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  webpackConfig = require('./webpack.config.base')

gulp.task('compile', () => {
  gulp.src('./src/**/*.js').pipe(gulpWebpack(webpackConfig()))
    .pipe(gulp.dest('./dist'))
})

gulp.task('develop', () => {
  gulp.watch('./src/**/*.js', ['compile']);
})
