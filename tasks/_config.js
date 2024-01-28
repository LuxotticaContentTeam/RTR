const 
    /**
    * Set a variable with all data from package.json file
    */
    pkg = require('../package.json'),
    path = require('path');
	conf = pkg.projectConfigurations
	projectConfigurations = require('../projectConfig.json');
	conf = {
		...conf,
		...projectConfigurations
	}
	brandsMap = {
		"OO":"oakley.com",
		"RB":"ray-ban.com",
		"SV":"salmoiraghievigano.it",
		"TO":"targetoptical.com",
		"LC":"lenscrafters.com",
		"SGH":"sunglasshut.com"
	}
module.exports = {
    /**
     * Configuration based on enviroment mode
     */
	brandsMap,
	conf : conf,
    isProd : process.env.NODE_ENV === 'production',
	isPreview : process.env.NODE_ENV === 'preview',
    imagePath : process.env.NODE_ENV === 'production' ? conf.paths.productionImage : conf.paths.developmentImage,
    confPath : process.env.NODE_ENV === 'production' ? conf.paths.productionConf : conf.paths.developmentConf,
    utilitiesPath: process.env.NODE_ENV === 'production' ? conf.paths.utilitiesPath : '',
    rtrPath: process.env.NODE_ENV === 'production' ? conf.paths.productionRTRPath : conf.paths.developmentRTRPath,
	now : Date.now(),

    /**
     * Path definition
     */
    // temporary folder
	temp_folder               : '.tmp',

	// Paths to source of assets
	src_folder                : conf.paths.srcFolder,
	src_asset_scss            : path.join(conf.paths.srcFolder, '/scss/**/*.scss'),
	src_asset_scss_brands	  : path.join(conf.paths.srcFolder, '/scss/brands/'),
	src_asset_scss_main       : path.join(conf.paths.srcFolder, '/scss/main.scss'),
	src_asset_js              : path.join(conf.paths.srcFolder, '/js/**/*.js'),
	src_asset_js_main         : path.join(conf.paths.srcFolder, '/js/main.js'),
	src_asset_js_brands       : path.join(conf.paths.srcFolder, '/js/brands/'),
	src_asset_img             : path.join(conf.paths.srcFolder, '/images/**/*.+(png|jpg|jpeg|gif|svg|ico|mp4)'),
	src_asset_font            : path.join(conf.paths.srcFolder, '/fonts/**/*.{eot,svg,ttf,woff,woff2}'),
	src_asset_html            : path.join(conf.paths.srcFolder, '/index.html'),
	src_asset_html_parts      : path.join(conf.paths.srcFolder, '/views/**/*.html'),
	src_asset_pug             : path.join(conf.paths.srcFolder, '/views/*.pug'),
	src_asset_pug_parts       : path.join(conf.paths.srcFolder, '/views/**/*.pug'),
	// Add any other assets that just need to be copied over to dist folder
	src_static_assets        : path.join(conf.paths.srcFolder, '/static/**/*'),
	src_generic_assets        : path.join(conf.paths.srcFolder, '/json/json.js'),
	src_generic_assets_brands : path.join(conf.paths.srcFolder, '/json/brands/'),
	
	// Paths you want to output assets to
	dist_folder               : conf.paths.distFolder, // change to whatever root you want it to be.
	dist_css                  : path.join(conf.paths.distFolder, '/css'),
	dist_js                   : path.join(conf.paths.distFolder, '/js'),
	dist_vendors              : path.join(conf.paths.distFolder, 'vendors'),
	dist_img                  : path.join(conf.paths.distFolder, '/images'),
	dist_font                 : path.join(conf.paths.distFolder, '/fonts'),
	dist_html                 : path.join(conf.paths.distFolder, '/**/*.{twig,html}'),
	dist_json                 : path.join(conf.paths.distFolder, '/json'),
	dist_static_assets        : path.join(conf.paths.distFolder, '/static'),
	dist_release              : './release',
	dist_ghPages              : './test',

	assetVersion              : pkg.version,
	release                   : pkg.version,
	projectName               : conf.projectName,
	buildVersion              : new Date().getTime()
}