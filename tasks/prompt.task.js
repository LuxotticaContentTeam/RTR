/**
 * Prompt command to set project variables
 */

let 
    { src } = require('gulp'),
    fs = require('fs'),
    $ = require('gulp-load-plugins')({ pattern: ['gulp-*'] }), // Setting a global variable to include all glup- plugin
    { conf, isProd, brandsMap } = require('./_config.js');
    projectConfiguration = require('../projectConfig.json');


const getBrandExtendedName = (selectedBrand) => {
    let brandClean = selectedBrand.split('_')[0]
    let brandExtendedName = '';
    brandExtendedName = brandsMap[brandClean]
    return brandExtendedName
}
module.exports = function prompt(cb) {
    let question = [
        {
            type:'list',
            name:'lang',
            message:'Hello, please choose language',
            choices: projectConfiguration.langs
        },
        {
            type:'list',
            name:'brand',
            message:'Please choose brand',
            choices: conf.brands
        }
    ]
    if (isProd){
        question[0] = {
            type:'list',
            name:'release',
            message:'Create release?',
            choices: ['yes','no']
        }
    }
    return src( ['projectConfig.json'] )
        .pipe( $.prompt.prompt(question, (res) => {
            console.log('Result', res);
            global.projLanguage = res.lang ? res.lang : undefined;
            global.isRelease = res.release === 'yes' ? true : false;
            global.selectedBrand = res.brand;
            global.selectedBrandExtendedName = getBrandExtendedName(res.brand);
            cb();
        }));
}