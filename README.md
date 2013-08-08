### easypack - The super simple js and css build tool.

This build tool will take your html file, and pickup all the static css and js files you have marked and will join them into single js and css files and will publish a new html file for you. It can also optionally do a simple minify (currently no bells and whistles) on js and css files. 

#Installation 
```
$ npm install easypack
```


#Usage
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
# Marking scripts for build

Suppose the main html of your web site is main.html here is how to mark the scripts that build tool should bundle into one file.

```
<script src='js/events.js' data-build="true"></script>
<script src='js/ui.js' data-build="true"></script>
<script src='js/main.js' data-build="true"></script>
<script src='js/lib.js' ></script>
```

easypack will pick up the first three scripts in the list and combine them into one javasctipt file which you provided in options using 'jsbuild' option.
Then a new html file will be generated at the same path as main.html, with the new combined script included. All the scripts that were not marked for building will be left alone.

 
### Warning
The tool is in its very early stages, so be careful :) 


### Authors and Contributors
Shaunak Vairagare (@shaunakv1).
