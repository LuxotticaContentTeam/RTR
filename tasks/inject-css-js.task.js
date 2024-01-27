 /**
  * Inject css or js in the html
  */

const
    { src, dest } = require('gulp');
    $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] }), // Setting a global variable to include all glup- plugin
    streamSeries = require('stream-series'),
    browserSync = require('browser-sync').create(),
    path = require('path');

let
    { dist_folder, dist_js, dist_css, dist_html, dist_vendors, dist_generic, isPreview, dist_ghPages, dist_json } = require('./_config.js');

module.exports = function inject(){
    var source;
    if (isPreview){
        sources = src([path.join(dist_ghPages,global.selectedBrand, '**/*.css'),path.join(dist_ghPages,global.selectedBrand,'json','**/*.js'), path.join(dist_ghPages,global.selectedBrand,'js',global.selectedBrand, '*.js')], {read: false});

    }else{
        sources = src([path.join(dist_css, '**/*.css'),path.join(dist_json,'**/*.js'), path.join(dist_js,global.selectedBrand, '*.js')], {read: false});
    }
    const vendors = src([path.join(dist_vendors, '**/*.css'), path.join(dist_vendors, '**/*.js')], {read: false})
    return src(isPreview ? path.join(dist_ghPages,global.selectedBrand,'index.html')  : dist_html)
        .pipe($.inject(streamSeries(vendors, sources), {
            ignorePath: dist_folder,
            addRootSlash: false,
            addPrefix: isPreview ? 'https://luxotticacontentteam.github.io/SMV2' : ''
        }))
        .pipe($.debug())
        .pipe(dest(isPreview ? path.join(dist_ghPages,global.selectedBrand) : dist_folder))
        .pipe(browserSync.stream());
}