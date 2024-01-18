 /**
  * Compile scss files into css.
  * Is variables is needed add it in the options
*/

let 
    { src, dest, series } = require('gulp'),
    log = require('fancy-log'),
    c = require('ansi-colors'),
    fs = require('fs'),
    $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] }), // Setting a global variable to include all glup- plugin
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass')(require('sass')),
    path = require('path'),
    { isProd, dist_css, src_asset_scss_main, src_asset_scss_brands, isPreProd, dist_folder, release, dist_export, dist_release, dist_ghPages } = require('./_config.js');

const scss = (done) => {
    log(`-> Style: compiling scss`);

    const brandMainScssPath = path.join(src_asset_scss_brands, global.selectedBrand, 'main.scss');
    if (!fs.existsSync(brandMainScssPath)) {
        log(c.red.bold(`🛑 File ${brandMainScssPath} does not exist`));
        done();
        return;
    }

    return src([src_asset_scss_main, brandMainScssPath])
        .pipe($.if(!(isProd || isPreProd), $.sourcemaps.init()))
        .pipe($.plumber())
        .pipe($.dependents())
        .pipe($.debug())
        .pipe($.sassVariables({
            $env: isProd ? 'production' : 'development',
            $brand: global.selectedBrand
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe($.if(!(isProd || isPreProd), $.sourcemaps.write()))
        .pipe($.concat('main.css'))
        .pipe(dest('.tmp/css'));
};

const postcss = () => {
    const f = $.filter(['.tmp/css/*.css'], {restore: true});

    log(`-> Style: run post scss`);

    return src(['.tmp/css/**/*.css'])
        .pipe(f)
        .pipe($.if(!(isProd || isPreProd), $.sourcemaps.init({loadMaps: true})))
        .pipe($.plumber())
        .pipe($.postcss([
                require('autoprefixer'),
                (isProd || isPreProd) ? require('cssnano')({ preset: 'default' }) : false
            ].filter(Boolean)))
        .pipe($.if(!(isProd || isPreProd), $.sourcemaps.write()))
        .pipe(f.restore)
        .pipe($.if((isProd || isPreProd), $.rename({ suffix: '.min' })))
        .pipe($.size({showFiles: true}))
        .pipe(dest(isPreProd ? path.join(dist_ghPages,global.selectedBrand,'css') :dist_css))
        .pipe(browserSync.stream());
};

    

const exportCss = (done) => {
    if (!global.isRelease) return done();
    return src(path.join(dist_css,"main.min.css")) 
        .pipe($.if((isProd), $.rename({basename: `main__${release}`, suffix: '.min' })))
        .pipe( dest(path.join(dist_release,global.selectedBrand,release)) )
}

module.exports = {
    style: series(
        scss,
        postcss,
      
    ),
    exportCss
}