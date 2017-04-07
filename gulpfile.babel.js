'use strict';

import gulp from 'gulp';
import del from 'del';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// const gutil = require('gulp-util');
// const webpack = require('webpack');
// const webpackConfig = require('./webpack.config.js');

const webpack = require('webpack-stream');
// const postcss = require('postcss');
const cssnext = require("postcss-cssnext");
const postcssNested = require('postcss-nested');
const precss = require('precss');
const cssnano = require('cssnano');
const rucksack = require('rucksack-css');
const lost = require('lost');

const AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  '>1%',
  'ie >= 9',
  'ie_mob >= 10',
  'chrome >= 34',
  'safari >= 7',
  'ios >= 7',
  'Android >= 30',
];

const PATH = {
  build: {
    html: 'build/',
    js: {
      vendor: 'build/js/',
      app: 'build/js/'
    },
    styles: 'build/css/',
    img: 'build/img/',
    pic: 'build/pic/',
    fonts: 'build/fonts/',
    vendor: 'build/vendor/'
  },
  src: {
    html: 'src/pug/*.pug',
    js: {
      vendor: 'src/js/vendor/vendor.js',
      app: 'src/js/app/application.js'
    },
    // styles: 'src/sass/application.scss',
    styles: {
      app: 'src/css/app/main.css',
      vendor: 'src/css/vendor/vendor.css',
    },
    img: 'src/img/**/*',
    pic: 'src/pic/**/*',
    fonts: 'src/fonts/**/*',
    vendor: 'src/vendor/**/*.{css,jpg,jpeg,png,ico,gif,svg,eot,ttf,woff,woff2}'
  },
  watch: {
    html: 'src/pug/**/*.pug',
    js: {
      vendor: 'src/js/vendor/**/*.js',
      app: 'src/js/app/**/*.js'
    },
    // styles: 'src/sass/**/*',
    styles: {
      app: 'src/css/app/**/*',
      vendor: 'src/css/vendor/**/*',
    },
    img: 'src/img/**/*',
    pic: 'src/pic/**/*',
    fonts: 'src/fonts/**/*',
    vendor: 'src/vendor/**/*'
  },
  clean: 'build/*'
};

const BROWSERSYNC_CONFIG = {
  server: ["build"],
  notify: false,
  open: false,
  tunnel: false,
  host: "markup",
  port: 9004,
  logPrefix: "browserSync"
};

const FILEINCLUDE_CONFIG = {
  prefix: '//= ',
  basepath: '@file'
};

gulp.task('webpack', function() {
  return gulp.src('src/js/main.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

// POSTCSS APP
gulp.task('build:styles:app', () => {
  let processors = [
        cssnext({
          autoprefixer : false
        }),
        postcssNested(),
        precss(),
        rucksack({
          autoprefixer: false
        }),
        lost(),
        cssnano(),
    ];
  gulp.src(PATH.src.styles.app)
    .pipe($.plumber())
    .pipe($.postcss(processors))
    .pipe($.sourcemaps.init())
    .pipe($.sourcemaps.write('./'))
    .pipe($.if(!browserSync.active, $.size({title: 'styles'})))
  .pipe(gulp.dest(PATH.build.styles))
  .pipe(browserSync.stream({match: '**/*.css'}))
});

// POSTCSS VENDOR
gulp.task('build:styles:vendor', () => {
  let processors = [
        precss(),
        cssnano(),
    ];
  gulp.src(PATH.src.styles.vendor)
    .pipe($.plumber())
    .pipe($.postcss(processors))
    .pipe($.if(!browserSync.active, $.size({title: 'styles'})))
  .pipe(gulp.dest(PATH.build.styles))
  .pipe(browserSync.stream({match: '**/*.css'}))
});

// gulp.task('lint', () =>
//   gulp.src(PATH.watch.js.app)
//     .pipe($.eslint())
//     .pipe($.eslint.format())
//     .pipe($.if(!browserSync.active, $.eslint.failOnError()))
// );

gulp.task('clean:build', () => del(PATH.clean, {dot: true}));
gulp.task('clean:cache', (cb) => $.cache.clearAll(cb));

gulp.task('serve', () => browserSync(BROWSERSYNC_CONFIG));

gulp.task('todo', () => {
  gulp.src([PATH.watch.js.app, PATH.watch.html, PATH.watch.styles])
    .pipe($.plumber())
    .pipe($.todo({
      // abrowserSyncolute: true,
      customTags: ['NOTE'], // NOTE, TODO, FIXME are supported
      verbose: true
    }))
    // .pipe(gulp.dest('./'))
});

gulp.task('build:vendor', () => {
  gulp.src(PATH.src.vendor)
    .pipe($.changed(PATH.build.vendor, {hasChanged: $.changed.compareSha1Digest}))
    .pipe($.size({title: 'vendor'}))
  .pipe(gulp.dest(PATH.build.vendor))
});

gulp.task('build:html', () => {
  gulp.src(PATH.src.html)
    .pipe($.plumber())
    .pipe($.pug({
      pretty: true,
    }))
    .pipe($.changed(PATH.build.html, {hasChanged: $.changed.compareSha1Digest}))
    .pipe($.if(!browserSync.active, $.size({title: 'html', showFiles: true})))
  .pipe(gulp.dest(PATH.build.html))
  .pipe(browserSync.stream())
});

gulp.task('build:js:vendor', () => {
  gulp.src(PATH.src.js.vendor)
    .pipe($.plumber())
    .pipe($.fileInclude(FILEINCLUDE_CONFIG))
    // .pipe($.sourcemaps.init())
      .pipe($.uglify())
    // .pipe($.sourcemaps.write('./'))
  .pipe(gulp.dest(PATH.build.js.vendor))
  .pipe(browserSync.stream())
});

gulp.task('build:js:app',  () => {
  gulp.src(PATH.src.js.app)
    .pipe($.plumber())
    .pipe($.fileInclude(FILEINCLUDE_CONFIG))
    .pipe($.sourcemaps.init())
      .pipe($.babel()) // config is in .babelrc
      .pipe($.uglify())
      // .pipe($.changed(PATH.build.js.app, {hasChanged: $.changed.compareSha1Digest}))
    .pipe($.sourcemaps.write('./'))
    .pipe($.if(!browserSync.active, $.size({title: 'js:app'})))
  .pipe(gulp.dest(PATH.build.js.app))
  .pipe(browserSync.stream())
});

// gulp.task('build:styles', () => {
//   gulp.src(PATH.src.styles)
//     .pipe($.plumber())
//     .pipe($.sass({outputStyle: 'expanded'}).on('error', $.sass.logError))
//     .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
//     .pipe($.sourcemaps.init())
//       .pipe($.if('*.css', $.cssnano()))
//     .pipe($.sourcemaps.write('./'))
//     .pipe($.if(!browserSync.active, $.size({title: 'styles'})))
//   .pipe(gulp.dest(PATH.build.styles))
//   .pipe(browserSync.stream({match: '**/*.css'}))
// });

gulp.task('build:img', () => {
  gulp.src(PATH.src.img)
    .pipe($.changed(PATH.build.img, {hasChanged: $.changed.compareSha1Digest}))
    // .pipe($.cache($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe($.cache($.imagemin()))
    .pipe($.size({title: 'img', showFiles: true}))
  .pipe(gulp.dest(PATH.build.img))
});

gulp.task('build:pic', () => {
  gulp.src(PATH.src.pic)
    .pipe($.changed(PATH.build.pic, {hasChanged: $.changed.compareSha1Digest}))
    .pipe($.size({title: 'pic', showFiles: true}))
  .pipe(gulp.dest(PATH.build.pic))
});

gulp.task('build:fonts', () => {
  gulp.src(PATH.src.fonts)
    .pipe($.changed(PATH.build.fonts, {hasChanged: $.changed.compareSha1Digest}))
    .pipe($.size({title: 'fonts', showFiles: true}))
  .pipe(gulp.dest(PATH.build.fonts))
});

gulp.task('build:prepare', ['build:vendor']);
gulp.task('build:styles', ['build:styles:vendor', 'build:styles:app']);
gulp.task('build:js', ['build:js:vendor', /*'build:js:app'*/]);

gulp.task('build', [
  'build:prepare',
  'webpack',
  'build:html',
  'build:js',
  'build:styles',
  'build:fonts',
  'build:img',
  'build:pic'
]);

gulp.task('clean', [
  'clean:build',
  'clean:cache'
]);

gulp.task('watch', () => {
  gulp.watch(PATH.watch.html, ['build:html']);
  // gulp.watch(PATH.watch.styles, ['build:styles']);
  gulp.watch(PATH.watch.styles.vendor, ['build:styles:vendor']);
  gulp.watch(PATH.watch.styles.app, ['build:styles:app']);
  gulp.watch(PATH.watch.js.vendor, ['build:js:vendor']);
  // gulp.watch(PATH.watch.js.app, ['build:js:app']);
  gulp.watch(PATH.watch.js.app, ['webpack']);
  gulp.watch(PATH.watch.img, ['build:img']);
  gulp.watch(PATH.watch.pic, ['build:pic']);
  gulp.watch(PATH.watch.fonts, ['build:fonts']);
});

gulp.task('default', ['build', 'serve', 'watch']);
