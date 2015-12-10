// Include gulp
var gulp = require('gulp');
require('gulp-grunt')(gulp);
var pngquant = require('imagemin-pngquant');
var assemble = require('assemble');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins({
                rename: {
                    'gulp-minify-css': 'minifycss',
                    'gulp-static-handlebars': 'hbshtml',
                    'gulp-assemble': 'gulpAssemble'
                }
              });

// Directory structures
var DIRECTORIES = {
    src : '/',
    publicStyles : 'app/public/styles/',
    privateStyles : 'app/src/styles/',
    publicScripts : 'app/public/js/',
    privateScripts : 'app/src/js/',
    publicVendorScripts : 'app/public/js/vendor/',
    privateVendorScripts : 'app/src/js/vendor/',    
    publicImages : 'app/public/images/',
    privateHtml : 'app/src/templates/',
    publicHtml : 'app/public/views/',
    privateData : 'app/src/data/'
};

// Function to fire everytime a file is changed and displayed the changes in the console
var changeEvent = function(evt) {
    plugins.util.log('File', plugins.util.colors.yellow(evt.path.replace(new RegExp('/.*(?=/' + DIRECTORIES.src + ')/'), '')), 'was', plugins.util.colors.green(evt.type));
};

// Clean public directories for styles/scripts
gulp.task('clean-styles', function(){
    return gulp.src(DIRECTORIES.publicStyles, {read: false})
        .pipe(plugins.clean());
});
gulp.task('clean-scripts', function(){
    return gulp.src([DIRECTORIES.publicScripts,!DIRECTORIES.publicScripts + 'vendor'], {read: false})
        .pipe(plugins.clean());
});

// Compile HTML files from Handlebars files
// @output: /public/views/html
// @note: Using Grunt to do this for us with 'gulp-grunt' plugin, assemble not yet available for gulp properly
gulp.task('assemble', function() {
    return gulp.start('grunt-assembleCopy');
});

// gulp.task('copyHtml', ['assemble'], function() {
//     var assets = plugins.useref.assets();

//     return gulp.src('app/src/*.html')
//     .pipe(assets)
//     .pipe(assets.restore())
//     .pipe(plugins.useref())
//     .pipe(gulp.dest(DIRECTORIES.publicHtml));
// });

gulp.task('copyImages', function() {
    return gulp.src('app/src/images/*.png')
    .pipe(gulp.dest(DIRECTORIES.publicImages));
});

// Compile Sass files, add autoprefixed CSS3 properties, minify the output CSS and finally concatenate into a single file for a single request
// @waits-for: 'clean-styles' task
// @output: /public/stylesheets/main.css
// 
gulp.task('sass', ['clean-styles'], function() {
    return gulp.src(DIRECTORIES.privateStyles + '/**/*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({ style: 'expanded',errLogToConsole: true }))
        .pipe(plugins.autoprefixer({browsers: ['last 3 versions']}))
        .pipe(plugins.minifycss({keepBreaks:false}))
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(DIRECTORIES.publicStyles))
        .pipe(plugins.size({showFiles:true,title:'Minfied CSS'}));
});

// Browserify JS files
gulp.task('browserify', function(){
    return gulp.src(DIRECTORIES.privateScripts + 'main.js')
        .pipe(plugins.browserify())
        .pipe(plugins.rename('build.min.js'))
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
});

// Concatenate & Minify JS after browserify task has run
// @waits-for: 'browserify' and 'clean-scripts' tasks
// @output: /public/javascript/build.min.js
// 
gulp.task('scripts', ['clean-scripts','browserify'], function() {
    return gulp.src(DIRECTORIES.publicScripts + 'build.min.js')
        .pipe(plugins.concat('build.min.js'))
        //.pipe(plugins.stripDebug()) --> USE FOR PRODUCTION
        .pipe(plugins.uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
        .pipe(plugins.size({showFiles:true,title:'Minfied javascript'}))
        .pipe(gulp.dest(DIRECTORIES.publicScripts))
        .pipe(plugins.jsdoc('./docs'));
});

gulp.task('vendorScripts', ['scripts'] ,function(){
    return gulp.src(DIRECTORIES.privateVendorScripts + '*.js')
    .pipe(gulp.dest(DIRECTORIES.publicVendorScripts));
});

// Minify all images on separate build task
// @output: /public/images/[images].png
gulp.task('imagemin', function () {
    return gulp.src('src/images/*.png')
        .pipe(pngquant({ quality: '65-80', speed: 10})())
        .pipe(gulp.dest(DIRECTORIES.publicImages));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch([DIRECTORIES.privateScripts + '*.js',DIRECTORIES.privateScripts + '/modules/*.js', DIRECTORIES.privateScripts + '/utilities/*.js'], ['browserify', 'scripts', 'vendorScripts']).on('change', function(event){
        changeEvent(event);
    });
    gulp.watch([DIRECTORIES.privateStyles + '*.scss',DIRECTORIES.privateStyles + '**/*.scss'], ['sass']).on('change', function(event){
        changeEvent(event);
    });
    gulp.watch([DIRECTORIES.privateHtml + 'layouts/*.hbs',DIRECTORIES.privateHtml + 'partials/*.hbs', DIRECTORIES.privateHtml + 'pages/*.hbs'], ['assemble']).on('change', function(event){
        changeEvent(event);
    });
    gulp.watch([DIRECTORIES.privateImages + '*.png',DIRECTORIES.privateImages + '*.gif',DIRECTORIES.privateImages + '*.jpg',DIRECTORIES.privateImages + '*.svg'], ['copyImages']).on('change', function(event){
        changeEvent(event);
    });
});

// Start server
gulp.task('connect', function() {
  plugins.connect.server({
    root: 'app/public',
    port: 8000
  });
});

// Default Task
gulp.task('default', ['sass', 'browserify', 'vendorScripts', 'copyImages', 'connect', 'watch']);
gulp.task('image', ['imagemin','copyImages']);