/**
 * Clean generated assets
 */

const 
    del = require('del'),
    log = require('fancy-log'),
    { dist_folder, isPreview, dist_ghPages } = require('./_config.js');


module.exports = async function clean(cb) {
    await del(isPreview ? path.join(dist_ghPages,global.selectedBrand) : dist_folder);
    cb();
}