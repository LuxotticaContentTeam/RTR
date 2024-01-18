/**
  * Move generic assets to dist folder
*/

let 
    { src, dest } = require('gulp'),
	fs = require('fs'),
	c = require('ansi-colors'),
    { src_folder, src_generic_assets, src_generic_assets_brands, dist_generic, dist_folder, isPreProd, dist_ghPages, dist_json } = require('./_config.js'),
    browserSync = require('browser-sync').create();

module.exports = function json(done) {

	//TODO: what is this?
	const dist_generic_assets = [];
	
	const genericAssetFiles = [
        {
            path: src_generic_assets,
            dest: '.'
        },
        {
            path: path.join(src_generic_assets_brands, global.selectedBrand, 'json.js'),
            dest: global.selectedBrand
        },
    ];
	
	if(src_generic_assets.length > 0 || src_generic_assets_brands.length > 0 ) {
		genericAssetFiles.map(file=>{
			if (!fs.existsSync(file.path)) {
				log(c.yellow.bold(`🟡 File ${file.path} does not exist`));
				done();
				streamFail = true;
			}else{
				log(c.green.bold(`✅ JSON file ${file.path}`));
				return src(file.path, {
					allowEmpty: true,
				})
				.pipe(dest(isPreProd ? path.join(dist_ghPages,global.selectedBrand,'json',file.dest) : path.join(dist_json,file.dest)))
				.pipe(browserSync.stream())
			}
		})
		
	}
}