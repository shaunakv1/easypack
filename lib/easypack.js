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
var WEB_ROOT;
var INPUT_HTML_FILE;
var OUTPUT_HTML_FILE;
var OUTPUT_JS_FILE;
var ADD_TIME_STAMP;

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

exports.build = function (options) {
    validateOptions(options);
    parseOptions(options);
    //console.log(getInputHtmlFile());
    fs.readFile(getInputHtmlFile(), "utf8",function(err,data){
        if(err) {
            terminateWith("Could not open file: " + err);
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
        console.log('Creating dir: '+getBuildDirLocation());
        fs.mkdirSync(getBuildDirLocation());
        console.log('Creating dir: '+getBuildDirLocation()+'/js');
        fs.mkdirSync(getBuildDirLocation()+'/js');
    } else {
        if (fs.existsSync(getBuildDirLocation()+'/js'))
            wrench.rmdirSyncRecursive(getBuildDirLocation()+'/js', 'failSilently');
        fs.mkdirSync(getBuildDirLocation()+'/js');
    }
}

function compressFiles(files,callback) {
    //console.log(files);
    var options = '-o ' + getOutputJSFile() + ' --comments  "/!|Copyright/" --stats --verbose'
    var command = "node "+__dirname+"/../node_modules/uglify-js/bin/uglifyjs " + files.join(' ') + " " + options;
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
        return WEB_ROOT+$(this).attr('src');
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
    return WEB_ROOT+INPUT_HTML_FILE;
}

function getOutHtmlFile () {
    return WEB_ROOT+OUTPUT_HTML_FILE;
}

function getBuildDirLocation () {
   return WEB_ROOT+'build';
}

function validateOptions (options) {
    if(typeof options === "undefined" )
        terminateWith("required options provided");

    var requiredOptions = ["inputHtml","outputHtml","jsBuildName"];
    for(var i in requiredOptions)
        if(typeof options[requiredOptions[i]] === "undefined" )
          terminateWith(requiredOptions[i]+ " options is not set");
}

function parseOptions (options) {
    //console.log(options);
    //optional
    WEB_ROOT = ((typeof options.webRoot === "undefined" ) ? "" : options.webRoot);
    if(WEB_ROOT !== "") WEB_ROOT += "/";
    ADD_TIME_STAMP = ((typeof options.timeStampBuild === "undefined" ) ? true : options.timeStampBuild);

    INPUT_HTML_FILE = options.inputHtml;
    OUTPUT_HTML_FILE = options.outputHtml;
    OUTPUT_JS_FILE = options.jsBuildName;
}

function terminateWith(err){
    console.error("easypack error: "+err);
    process.exit(1);
}