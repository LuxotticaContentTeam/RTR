/**
 * Clean generated assets
 */

const 
    del = require('del'),
    log = require('fancy-log'),
    { dist_folder, isPreProd, dist_ghPages } = require('./_config.js');


module.exports = async function clean(cb) {
    await del(isPreProd ? path.join(dist_ghPages,global.selectedBrand) : dist_folder);
    cb();
}