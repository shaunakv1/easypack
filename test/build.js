var sb = require('easypack');
sb.build({
    webRoot : '',
    inputHtml : "main.html",
    outputHtml : "index.html",
    jsBuildName : "app.js",
    timeStampBuild : true
});