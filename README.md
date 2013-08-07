### easypack - The super simple js and css build tool.

This build tool will take you html file, and pickup all the static css and js files you have marked and will join them into single js and css files and will publish a new html file for you. It can also optionally do a simple minify (currently no bells and whistles) on js and css files. 

Installation 
```
$ npm install easypack
```


Usage
```
var sb = require('easypack');
sb.build({
  webRoot : 'test',
	inputHtml : "main.html",
	outputHtml : "index.html",
	jsBuildName : "app.js",
	timeStampBuild : true
});
```

### Warning
The tool is in its very early stages, so be careful :) 


### Authors and Contributors
Shaunak Vairagare (@shaunakv1).
