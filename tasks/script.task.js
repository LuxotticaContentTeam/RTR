/**
 * Process javascript files.
 * Is possible to set value replace some string
*/

const { stream } = require('browser-sync');
const { isPreview, release, dist_export, dist_release, dist_ghPages, utilitiesPath, rtrPath, rtrImgPath } = require('./_config.js');

let 
    { src, dest, series, glob } = require('gulp'),
    $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] }), // Setting a global variable to include all glup- plugin
    browserSync = require('browser-sync').create(),
    log = require('fancy-log'),
    pkg = require('../package.json'),
    c = require('ansi-colors'),
    fs = require('fs'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
    replace = require('gulp-string-replace'),
    es = require('event-stream');
    path = require('path'),
    { src_asset_js_main, src_asset_js_brands, src_asset_js, isProd, dist_js, buildVersion, imagePath, confPath, now} = require('./_config.js');

const lint = () => {
    return src(src_asset_js)
        .pipe($.eslint({
            ecmaVersion: 'latest',
            parserOptions: {
                "ecmaVersion": 8,
                "sourceType": "module",
                "requireConfigFile": false
            },

            //List or rules at: https://eslint.org/docs/latest/rules/
            extends: "eslint:recommended",
            rules: {
                'no-useless-escape' : 0,
                'no-const-assign': 2,
            },

            globals: pkg.eslint.globals
        }))
        .pipe($.eslint.format())
        .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
};

const js = (done) => {
    let streamFail = false;

    const jsFiles = [
        {
            path: path.join(src_asset_js_brands, global.selectedBrand, 'main.js'),
            dest: global.selectedBrand
        },
        {
            path: src_asset_js_main,
            dest: '.'
        }
    ];

    let tasks = 
        jsFiles.map(function (file) {
            if (!fs.existsSync(file.path)) {
                log(c.red.bold(`🛑 File ${file.path} does not exist`));
                done();
                streamFail = true;
            }else{
                log(c.green.bold(`✅ Bundle File ${file.path}`));
                return browserify({
                        entries: [file.path]
                    })
                    .transform(babelify, { presets : ["@babel/preset-env"] })
                    .bundle()
                    .pipe($.plumber())
                    .pipe(source(`${file.dest}/main.js`))
                    .pipe(buffer())
                    .pipe($.if(!(isProd || isPreview), $.sourcemaps.init()))
                    .pipe($.if(isProd, $.uglify()))
                    .pipe($.if(!(isProd || isPreview), $.sourcemaps.write('./maps')))
                    .pipe(replace('@now@', now))
                    .pipe(replace('@env@', (isProd) ? 'production' : 'development' ))
                    .pipe(replace('@currentBrand@', global.selectedBrand ))
                    .pipe(replace('@imagePath@', imagePath ))
                    .pipe(replace('@confPath@', confPath ))
                    .pipe(replace('@language@', global.projLanguage ))
                    .pipe(replace('@rtrPath@', rtrPath ))
                    .pipe(replace('@rtrImgPath@', rtrImgPath ))
                    .pipe(replace('@utilitiesPath@', utilitiesPath.replace('BRAND',global.selectedBrandExtendedName) ))
                    .pipe($.if((isProd || isPreview), $.rename({ suffix: '.min' })))
                    .pipe( dest(isPreview ? path.join(dist_ghPages,global.selectedBrand,'js') : dist_js) )
                    .pipe(browserSync.stream())
                    

            }
        })
    

    if(streamFail) return;
    return es.merge.apply(null, tasks).on('end',()=>{done()}); // => thanks to https://fettblog.eu/gulp-browserify-multiple-bundles/

}

const concatScripts = (done) => {
    if (!global.isRelease) return done();
    return src([path.join(dist_js,global.selectedBrand,"main.min.js")]) 
        .pipe($.concat(`main__${release}.min.js`))
        .pipe( dest(path.join(dist_release,global.selectedBrand,release)) )
}

module.exports = { 
    script: series(
        lint,
        js
    ),
    concatScripts
   }