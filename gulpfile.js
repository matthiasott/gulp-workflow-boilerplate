//  Required packages and settings
const pkg           = require("./package.json"),
      gulp          = require('gulp'),
      sass          = require('gulp-sass'),
      concat        = require('gulp-concat'),
      sourcemaps    = require('gulp-sourcemaps'),
      uglify        = require('gulp-uglify'),
      autoprefixer  = require('gulp-autoprefixer'),
      cleanCSS      = require('gulp-clean-css'),
      rev           = require('gulp-rev'),
      sequence      = require('gulp-sequence'),
      clean         = require('gulp-clean'),
      rename        = require('gulp-rename'),
      revReplace      = require('gulp-rev-replace'),

      vendorscripts = [
          //e. g. './node_modules/slick-carousel/slick/slick.js'
          ],

      sassOptions = {
          errLogToConsole: true,
          outputStyle: 'compressed',
          //includePaths: ['node_modules/susy/sass']
        },
      uglifyOptions = {
        mangle: true,
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true
        }
      },
      svgSpriteOptions = {
        shape       : {
          dimension   : {     // Set maximum dimensions
            maxWidth  : 64,
            maxHeight : 64
          },
          spacing     : {     // Add padding
            padding   : 0
          },
          dest      : 'intermediate-svg'  // Keep the intermediate files
        },
        mode        : {
          view      : {     // Activate the «view» mode
            bust    : false,
            render    : {
              scss  : true    // Activate Sass output (with default options)
            }
          },
          inline        : true,   // Prepare for inline embedding
          symbol      : true    // Activate the «symbol» mode
        }
      };

const browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: pkg.directories.dist
        }
    });
});

// Static Server + watching scss/html files
gulp.task('serve', function() {

    sequence('copy', 'copy:img', 'copy:vendorjs', 'javascript', 'copy:js', 'styles', 'copy:styles', 'revreplace', 'watch')(function (err) {
      if (err) console.log(err)
    });
    
});

// Watch task: Watches for changes in the CSS and JS directiories
gulp.task('watch', function() {
  browserSync.init({
        server: pkg.directories.dist
    });

    gulp.watch(pkg.directories.src + '/assets/sass/**/*', function(event) {
      sequence('styles', 'copy:styles', 'revreplace')(function (err) {
        if (err) console.log(err)
      })
    });

    gulp.watch(pkg.directories.src + '/assets/js/**/*.js', function (event) {
      sequence('copy:js','javascript','revreplace')(function (err) {
      if (err) console.log(err)
      })
    });

    gulp.watch(pkg.directories.src + '/*.html', ['copy', 'revreplace']);
    gulp.watch([pkg.directories.dist + '/**/*']).on('change', browserSync.reload);
});

// Copy HTML and other static files
gulp.task('copy', function() {
    return gulp.src(pkg.directories.src + '/*.html')
        .pipe(gulp.dest('./dist'));
});

// Copy static images
gulp.task('copy:img', function() {
    return gulp.src(pkg.directories.src + '/assets/img/**/*')
        .pipe(gulp.dest(pkg.directories.dist + '/assets/img'));
});

// Copy static images
gulp.task('copy:fonts', function() {
    return gulp.src(pkg.directories.src + '/assets/fonts/**/*')
        .pipe(gulp.dest(pkg.directories.dist + '/assets/fonts'));
});

// Copy styles
gulp.task('copy:styles', function() {
    return gulp.src(pkg.directories.src + '/assets/css/**/*')
        .pipe(gulp.dest(pkg.directories.dist + '/assets/css'));
});

// Copy JavaScript
gulp.task('copy:js', function() {
    return gulp.src(pkg.directories.src + '/assets/js/**/*')
        .pipe(gulp.dest(pkg.directories.dist + '/assets/js'));
});

// Copy vendor JavaScript
gulp.task('copy:vendorjs', function() {
    return gulp.src(vendorscripts)
        .pipe(gulp.dest(pkg.directories.src + '/assets/js/vendor'));
});

// Clean up JavaScript in dist folder
gulp.task('clean:scripts', function () {
  return gulp.src(pkg.directories.dist + '/assets/js/*.js', {read: false})
    .pipe(clean());
});

// Clean up CSS in dist folder
gulp.task('clean:css', function () {
  return gulp.src(pkg.directories.dist + '/assets/css/*.css', {read: false})
    .pipe(clean());
});

// Build minified CSS
gulp.task('styles', ['clean:css'], function () {
    return gulp.src( pkg.directories.src + '/assets/sass/main.scss')
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest( pkg.directories.src + '/assets/css'));
});

// Concat and minify JavaScript
gulp.task('javascript', ['clean:scripts'], function() {
  return gulp.src([
    pkg.directories.src + '/assets/js/vendor/**/*.js',
    pkg.directories.src + '/assets/js/main.js'
    ])
    .pipe(sourcemaps.init())
      .pipe(concat('all.js'))
      //.pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(pkg.directories.src + '/assets/js'));
});

// Rev static CSS and JavaScript
gulp.task('revision', function(){
  return gulp.src([pkg.directories.dist + '/**/*.css', pkg.directories.dist + '/**/*.js'])
    .pipe(rev())
    .pipe(gulp.dest(pkg.directories.dist))
    .pipe(rev.manifest())
    .pipe(gulp.dest(pkg.directories.dist))
});

// Replace all occurences with the revisioned files
gulp.task('revreplace', ['revision'], function(){
  var manifest = gulp.src(pkg.directories.dist + '/rev-manifest.json');

  return gulp.src(pkg.directories.src + '/*.html')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(pkg.directories.dist));
});

// Main build: Runs all neccessary tasks
gulp.task('build', function(event){
  sequence('copy', 'copy:img', 'copy:fonts', 'copy:vendorjs', 'javascript', 'copy:js', 'styles', 'copy:styles', 'revreplace')(function (err) {
    if (err) console.log(err)
  });
});


gulp.task('default', ['serve']);