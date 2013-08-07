/*!
 * easypack.js v0.1.0
 *
 * (c) Shaunak Vairagare
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/**
 * Configurations
 */
var WEB_ROOT = 'test';
var INPUT_HTML_FILE = "main.html";
var OUTPUT_HTML_FILE = "index.html";
var OUTPUT_JS_FILE = "app.js";
var ADD_TIME_STAMP = true;

/**
 * Include Dependencies
 */
var cheerio = require('cheerio');
var fs = require('fs');
var validator = require('validator').check;
var UglifyJS = require("uglify-js");
var sys = require('sys');
var exec = require('child_process').exec;
var tidy = require('htmltidy').tidy;
var wrench = require('wrench');

/**
 * Build Script
 */
var $;
var jsfile;

exports.build = function () {
    fs.readFile(getInputHtmlFile(), "utf8",function(err,data){
        if(err) {
            console.error("Could not open file: %s", err);
            process.exit(1);
        }
        $ = cheerio.load(data);
        cleanup();
        compressFiles(getScriptFiles(),function(){
            removeExistingScriptTags();
        });
    });
};

function cleanup() {
    if (!fs.existsSync(getBuildDirLocation())) {
        fs.mkdirSync(getBuildDirLocation());
    } else {
        wrench.rmdirSyncRecursive(getBuildDirLocation()+'/js', 'failSilently');
        fs.mkdirSync(getBuildDirLocation()+'/js');
    }
}

function compressFiles(files,callback) {
    var options = '-o ' + getOutputJSFile() + ' --comments  "/!|Copyright/" --stats --verbose'
    var command = "node node_modules/uglify-js/bin/uglifyjs " + files.join(' ') + " " + options;
    //console.log(command);
    exec(command, function(error, stdout, stderr) {
        console.log(stderr);
        console.log(stdout);
        callback();
    });
}

function removeExistingScriptTags() {
    $('script').filter(function(i, obj) {
        return needsBuild($(this));
    }).replaceWith("");

    $('body').append("\t<script src='" + jsfile + "'></script>");

    var op = $.html();
    tidy(op, {
        indent: true,
        dropEmptyElements: false,
        mergeDivs: false,
        mergeSpans: false,
        wrap: 0,
        verticalSpace: false
    }, function(err, op) {
        fs.writeFileSync(getOutHtmlFile(), op);
    });
}

function getScriptFiles() {
    return $('script').filter(function(i, obj) {
        return needsBuild($(this));
    }).map(function(i, obj) {
        return WEB_ROOT+'/'+$(this).attr('src');
    });
}

function needsBuild(tag) {
    return tag.attr('data-build') && tag.attr('data-build') === "true";
}

function getOutputJSFile() {
    f = "/js/" + OUTPUT_JS_FILE;
    if (ADD_TIME_STAMP) f = f.replace('.js', '') + "-" + Date.now().toString() + ".js";
    jsfile = "build" + f;
    return getBuildDirLocation() + f;
}

function getInputHtmlFile(){
    return WEB_ROOT+'/'+INPUT_HTML_FILE;
}

function getOutHtmlFile () {
    return WEB_ROOT+'/'+OUTPUT_HTML_FILE;
}

function getBuildDirLocation () {
   return WEB_ROOT+'/build';
}