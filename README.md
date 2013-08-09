##easypack - The super simple js and css build tool.

Ever wished you had in your fontend only webprojects, the cool feature of popular web-frameworks like rails that 
preprocess all the static js and css files before pushing your webpages to production? Thats exactly easypacks does! 

[Easypack](http://shaunakv1.github.io/easypack/) will take your html file, and pickup all the static css and js files you have marked and will join them into single js and css files and will publish a new html file for you. It can also optionally do a simple minify (currently no bells and whistles) on js and css files. 

###Installation 
[Download Node.js](http://nodejs.org/download/) if you haven't already. Then inside the webroot directory run:
```
$ npm install easypack
```


###Usage
Create a build.js file like below and execute it using nodejs
```js
/*
* Sample build.js
*/

var sb = require('easypack');
sb.build({
  	webRoot : 'yourWebRootDir',
	inputHtml : "main.html",  
	outputHtml : "index.html",
	jsBuildName : "app.js",
	timeStampBuild : true
});
```
> Note: If you installed easypack within ther webroot of your website then leave ``` webRoot : '' ``` or donot provide this option. Optionally
if you installed easypack outside your webroot, then provide a relative or absoloute path to webroot in your build script.

###Marking scripts for build

Suppose the main html of your web site is main.html here is how to mark the scripts that build tool should bundle into one file.
Notice the **data-build="true"** attribute in the script tags. Thats what marks scripts to be picked up. 

```html
<!-
  Input: main.html
->
<script src='js/events.js' data-build="true"></script>
<script src='js/ui.js' data-build="true"></script>
<script src='js/main.js' data-build="true"></script>
<script src='js/lib.js' ></script>

```
After Build:

```html
<!-
  Output: index.html
->

<script src='js/lib.js' ></script>
<script src="build/js/app-1375900584550.js"></script>

```

easypack will pick up the first three scripts in the list and combine them into one javasctipt file which you provided in options using 'jsbuild' option.
Then a new html file will be generated at the same path as main.html, with the new combined script included. All the scripts that were not marked for building will be left alone.

### Timestamps
if 'timeStampBuild' is set to true, easypack will add a timestamp to the packed javascript file everytile you run the build script.
For example:

```html
<script src="build/js/app-1375900584550.js"></script>
```
Why do this? So that when you push put new code you can be sure that browsers will discard the cached copies of your old code and fetch a new one! 

##Learn by example

1. Install [Node.js](http://nodejs.org/download/)

2. Download [examples](https://github.com/shaunakv1/easypack/archive/examples.zip)

3. At the same level as the main.html install easypack:
```
$ npm install easypack 
```

4. Then run the build.js 
```
$ node build.js
```

5. Thats it! You should see a index.html generated alongside main.html. Notice the difference between javascripts and css included between the two. 



### Warning
The support for packing css file is present too in exactly similar way as js files using parameter ```cssBuildName : "yourstyle.css"``` 
but it needs some more refining and hence it is not mentioned above. Coming up soon! 

The tool is in its very early stages, so be careful :) 



### Authors and Contributors
Shaunak Vairagare (@shaunakv1).
