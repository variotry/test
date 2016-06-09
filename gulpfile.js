/// <binding Clean='clean' />
"use strict";

var gulp = require( "gulp" ),
    rimraf = require( "rimraf" ),
    concat = require( "gulp-concat" ),
    cssmin = require( "gulp-cssmin" ),
    uglify = require( "gulp-uglify" );
var typescript = require( "gulp-typescript" ),
	plumber = require( "gulp-plumber" ),
	sourcemaps = require( "gulp-sourcemaps" ),
	rename = require( "gulp-rename" ),
	babel = require( "gulp-babel" );
var sequence = require( "gulp-sequence" );

var webroot = "./wwwroot/";

var paths = {
    js: webroot + "js/**/*.js",
    minJs: webroot + "js/**/*.min.js",
    css: webroot + "css/**/*.css",
    minCss: webroot + "css/**/*.min.css",
    concatJsDest: webroot + "js/site.min.js",
    concatCssDest: webroot + "css/site.min.css"
};

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task( "build:ts", function ()
{
	var tsConfig = require( "./tsconfig.json" );

	return gulp.src( ["ts/**/*.ts", "typings/main.d.ts", "typings/globals/**/index.d.ts"] )
		.pipe( plumber() )
		.pipe( sourcemaps.init() )
		.pipe( typescript( tsConfig.compilerOptions ) )
		//.pipe( babel() )
		.pipe( uglify( {
			preserveComments: "some"
		} ) )
		.pipe( rename( function ( path )
		{
			return path.extname = ".min.js";
		} ) )
		.pipe( sourcemaps.write( "../sourcemaps/ts" ) )
		.pipe( gulp.dest( "wwwroot/js" ) );
} );

gulp.task( "watch:ts", ["build:ts"], function ()
{
	return gulp.watch( "ts/**/*.ts", ["build:ts"] );
} );

gulp.task( "copy:angular", callback =>
{
	var packages = ["@angular", "rxjs"];
	var taskNames = [];
	packages.forEach( p =>
	{
		var task = "private_angular:" + p;
		taskNames.push( task );
		gulp.task( task, () =>
		{
			return gulp.src( "node_modules/" + p + "/**/*.js" )
					.pipe( gulp.dest( "wwwroot/lib/" + p ) );
		} );
	} );
	return sequence( taskNames, callback );
} );