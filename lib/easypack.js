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
var OUTPUT_CSS_FILE = 'app.css';
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
var cssfile;

exports.build = function (options) {
    validateOptions(options);
    parseOptions(options);
    //console.log(getInputHtmlFile());
    fs.readFile(getInputHtmlFile(), "utf8",function(err,data){
        if(err) {
            terminateWith("Could not open file: " + err);
        }
        $ = cheerio.load(data);
        cleanupBuild();
        compressJsFiles(getScriptFiles(),function(){
            removeExistingJSTags();
            compressCssFiles(getCssFiles(),function(){
                console.log('...done');
                removeExistingCssTags();
                writeOutNewHtml();
            });
        });

    });
};

function cleanupBuild() {
    console.log('#1 Cleaning up Build');
    if (!fs.existsSync(getBuildDirLocation())) {
        console.log('\tCreating dir: '+getBuildDirLocation());
        fs.mkdirSync(getBuildDirLocation());
    }
    var dir = ["/js","/css"];
        for(var i in dir)
        {
            var d = getBuildDirLocation()+dir[i];
            if (fs.existsSync(d)){
                console.log('\tRemoving dir :'+d);
                wrench.rmdirSyncRecursive(d, 'failSilently');
            }
            console.log('\tCreating dir :'+d);
            fs.mkdirSync(d);
        }
}

function compressJsFiles(files,callback) {
    console.log('#2 Compressing JavaScripts');
    var options = '-o ' + getOutputJSFile() + ' --comments  "/!|Copyright/" --stats --verbose'
    var command = "node "+__dirname+"/../node_modules/uglify-js/bin/uglifyjs " + files.join(' ') + " " + options;
    //console.log(command);
    exec(command, function(error, stdout, stderr) {
        console.log(stderr);
        console.log(stdout);
        callback();
    });
}

function removeExistingJSTags() {
    console.log('#3 Removing existing JavaScript tags');
    $('script').filter(function(i, obj) {
        return needsBuild($(this));
    }).replaceWith("");
}

function compressCssFiles(files,callback) {
    console.log('#4 Compressing Stylesheets');
    var command = "node "+__dirname+"/../node_modules/uglifycss/uglifycss " + files.join(' ') + " > " + getOutputCssFile();
   // console.log(command);
    exec(command, function(error, stdout, stderr) {
        console.log(stderr);
        console.log(stdout);
        callback();
    });
}

function removeExistingCssTags() {
    console.log('#5 Removing existing stylesheet tags');
    $('link').filter(function(i, obj) {
        return needsBuild($(this)) && isCss($(this));
    }).replaceWith("");
}

function writeOutNewHtml(){
    console.log('#6 Generating new html');
    $('body').append("\t<script src='" + jsfile + "'></script>");
    $('head').append("\t<link rel='stylesheet' href='" + cssfile + "'></link>");
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

function getCssFiles() {
    return $('link').filter(function(i, obj) {
        return needsBuild($(this)) && isCss($(this));
    }).map(function(i, obj) {
        return WEB_ROOT+$(this).attr('href');
    });
}

function needsBuild(tag) {
    return tag.attr('data-build') && tag.attr('data-build') === "true";
}

function isCss(tag) {
    return tag.attr('data-build') && tag.attr('rel') === "stylesheet";
}

function getOutputJSFile() {
    f = "/js/" + OUTPUT_JS_FILE;
    if (ADD_TIME_STAMP) f = f.replace('.js', '') + "-" + Date.now().toString() + ".js";
    jsfile = "build" + f;
    return getBuildDirLocation() + f;
}

function getOutputCssFile () {
    f = "/css/" + OUTPUT_CSS_FILE;
    if (ADD_TIME_STAMP) f = f.replace('.css', '') + "-" + Date.now().toString() + ".css";
    cssfile = "build" + f;
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

    var requiredOptions = ["inputHtml","outputHtml","jsBuildName","cssBuildName"];
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