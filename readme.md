# viewjson [![Build Status](https://secure.travis-ci.org/outring/viewjson.png?branch=master)](http://travis-ci.org/outring/viewjson)

Simple yet powerful and extensible JSON to HTML renderer.

## Usage
```
var viewjson = require("viewjson");

var html = viewjson.render({ tag: "p", content: "Hello, HTML!" });
```

## Options
```
var viewjson = require("viewjson");
var html = viewjson.render({ }, {
    xhtml: true, //false by default, enables correct self-closing tags rendering i.e. <br /> instead of <br>,
    transforms: [] //array of transforms to apply to template, see examples below
});
```

##Available transforms
* [escape](//github.com/outring/viewjson-escape)
* [bem](//github.com/outring/viewjson-bem)