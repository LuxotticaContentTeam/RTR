const {projectLang} = require('./tasks/_config.js');
const log = require('fancy-log');
const { series } = require('gulp');

// Require custom tasks
const prompt                    = require('./tasks/prompt.task.js');
const clean                     = require('./tasks/clean.task.js');
const {views, exportViews}                     = require('./tasks/views.task.js');
const json             = require('./tasks/json.task.js');
const images                    = require('./tasks/images.task.js');
const vendors                   = require('./tasks/vendors.task.js');
const {style, exportCss}                   = require('./tasks/style.task.js');
const {script, concatScripts}   = require('./tasks/script.task.js');
const bs                        = require('./tasks/browser-sync.task.js');
const inject                    = require('./tasks/inject-css-js.task.js');
const watcher                   = require('./tasks/watcher.task.js');
const staticAsset               = require('./tasks/staticAsset.task.js');

exports.serve = series(
    // Run prompt to ask witch language
    prompt,
    clean,
    views,
    json,
    staticAsset,
    vendors,
    images,
    style,
    script,
    inject,
    bs,
    watcher
);

exports.prebuild = series(
    // Run prompt to ask witch language
    prompt,
    clean,
    views,
    json,
    staticAsset,
    vendors,
    images,
    style,
    script,
    inject,
);

exports.build = series(
    // Run prompt to ask witch language
    prompt,
    clean,
    views,
    exportViews,
    json,
    staticAsset,
    vendors,
    images,
    style,
    exportCss,
    script,
    concatScripts
);