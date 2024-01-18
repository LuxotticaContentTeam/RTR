/**
 * Watch file changes and run relative task
 */

// Require custom tasks
const {views}          = require('./views.task.js');
const images         = require('./images.task.js');
const {style}        = require('./style.task.js');
const {script}         = require('./script.task.js');
const inject         = require('./inject-css-js.task.js');

const
    { watch, series } = require('gulp'),
    browserSync = require('browser-sync').create('dev'),
    log = require('fancy-log');

let
    { 
        src_asset_html_parts, 
        src_asset_pug, 
        src_asset_pug_parts, 
        src_asset_scss, 
        src_asset_js, 
        src_asset_img, 
        dist_html,
        src_generic_assets,
        src_generic_assets_brands,
    } = require('./_config.js');
const genericAssetsTask = require('./json.task.js');

module.exports = function watcher(){

    log('-> Watching files in /src folder...');
 
    // Watch normal HTML
    watch(src_asset_html_parts, 
        series([views, style, inject, (cb) => {
            browserSync.reload();
        }])
    );

    // Watch pug files
    watch(src_asset_pug, 
        series([views, inject, function reload(cb) {
            browserSync.reload();
            cb();
        }])
    )

    watch(src_asset_pug_parts, 
        series([views, inject, function reload(cb) {
            browserSync.reload();
            cb();
        }])
    )


    // Watch syles
    watch(src_asset_scss, series(style));

    // Watch scripts
    watch(src_asset_js, series(script));
    watch(src_generic_assets, series(genericAssetsTask));
    watch(src_generic_assets_brands, series(genericAssetsTask));

    // Watch images
    watch(src_asset_img, 
        series(images)
    ).on('change', browserSync.reload);

}