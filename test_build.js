var sb = require('./lib/easypack');
sb.build({
	webRoot : 'test',
	inputHtml : "main.html",
	outputHtml : "index.html",
	jsBuildName : "app.js",
	cssBuildName : "app-css.css",
	timeStampBuild : true
});

/**
 * Sample webRoot:
 *
 * webRoot : 'C:\\Projects\\Sites\\tmp\\test'  # for absoloute path
 * webRoot : 'test' # for relative path
 *
 */

/*var styletto = require("styletto");

var config = {
    "input": ["test/css/styleA.css", "test/css/styleB.css","test/css/styleC.css", "test/css/font-awesome.css"],
    "output": "test/build/css/output.css",
    "compress": "csso",
    "base64": 15000,
    "errors": "ignore",
    "path": process.cwd()
}

styletto( config, function(err, sucess, css ) {	
	console.log("Compressing css done..");
});*/