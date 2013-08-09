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