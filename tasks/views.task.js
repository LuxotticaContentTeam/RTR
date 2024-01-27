 /** 
  * Pug compiler.
  * To set up a variable, add it on the `pugOps` object or insert in the pug file: `#{gulpFileGlobalVar}`
* */ 

let
    { src, dest } = require('gulp'),
    $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] }), // Setting a global variable to include all glup- plugin
    { src_asset_pug, temp_folder, isProd, dist_folder, isPreview, projectName, dist_ghPages, dist_html, release, dist_release } = require('./_config.js'),
    browserSync = require('browser-sync').create();

const views = function views(cb) {

    let pugOps = {
        pretty  :   true,
        locals : {
            isProd : isProd,
            brand : global.selectedBrand,
            isPreview : isPreview,
            lang: !isProd ? global.projLanguage.split('-')[0]:null,
            country:!isProd ? global.projLanguage:null,
            projectName : global.selectedBrand + ' | ' + projectName 
        }
    };

    return src(src_asset_pug)
        .pipe($.pug(pugOps))
        .pipe(dest(isPreview ? path.join(dist_ghPages,global.selectedBrand ): dist_folder))

};

const exportViews = (done) => {
    if (!global.isRelease) return done();
    return src(path.join(dist_html)) 
        .pipe($.if((isProd), $.rename({basename: `index__${release}` })))
        .pipe( dest(path.join(dist_release,global.selectedBrand,release)) )
}
module.exports ={
    views,
    exportViews
}