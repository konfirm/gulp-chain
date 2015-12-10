[![npm version](https://badge.fury.io/js/gulp-chain.svg)](http://badge.fury.io/js/gulp-chain)
[![Build Status](https://travis-ci.org/konfirm/gulp-chain.svg?branch=master)](https://travis-ci.org/konfirm/gulp-chain)
[![Coverage Status](https://coveralls.io/repos/konfirm/gulp-chain/badge.svg?branch=master)](https://coveralls.io/r/konfirm/gulp-chain?branch=master)
[![dependencies](https://david-dm.org/konfirm/gulp-chain.svg)](https://david-dm.org/konfirm/gulp-chain#info=dependencies)
[![dev-dependencies](https://david-dm.org/konfirm/gulp-chain/dev-status.svg)](https://david-dm.org/konfirm/gulp-chain#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/4e13495f8e9d4ca0b88056b963b33bc0)](https://www.codacy.com/app/rogier/gulp-chain)

# gulp-chain
Prepare a chain of pipes for use as a gulp plugin (or any other piped stream, there is no true dependency of gulp)

## Installation

```
npm install --save-dev gulp-chain
```

As of version 2.0.0 `gulp-chain` requires NodeJS 4 or higher. If you are 'stuck' on NodeJS 0.10 - 0.12, you will need to specify the version (the latest in the v1 range is 1.1.0).

```
$ npm install --save-dev gulp-chain@^1.1.0
```


### Usage
```js
var chain = require('gulp-chain'),
	myStream = chain(function(stream) {
		return stream
			.pipe(pluginA())
			.pipe(pluginB())
			.pipe(pluginC())
		;
	});

//  later on:
gulp.task('mytask', function() {
	gulp.src('./source/**/*')
		.pipe(pluginD())
		//  add the created myStream
		.pipe(myStream())
		//  and pipe it towards another plugin
		.pipe(pluginE())
		.pipe(gulp.dest('./destination'))
	;
});
```

### API
#### `chain(function prepare [, ... ])`
With `gulp-chain` you can prepare pretty much every chain, even provide default arguments.
The `function prepare` has the following signature; `function(stream input [, ... ])`
This means that `gulp-chain` always provides a stream as first argument, followed by any argument given or predefined.
The return value of `gulp-chain` is always a function which returns a stream that you can pipe into (like any other plugin in `gulp`).

##### Set up default arguments
In the following example, we prepare a chain which has an argument `hello`, which is set to the value `'hello world'` by default.
```js
var chain = require('gulp-chain'),
	myStream = chain(function(stream, hello) {
		return stream
			.pipe(pluginA())
			.pipe(pluginB(hello))
			.pipe(pluginC())
		;
	}, 'hello world');
```

If the `myStream`-'plugin' is used without any arguments, the value of `hello` will contain `'hello world'`
```js
gulp.task('mytask', function() {
	gulp.src('./source/**/*')
		//  add the created myStream
		//  myStream will actually be invoked as: myStream('hello world')
		.pipe(myStream())  

		.pipe(gulp.dest('./destination'))
	;
});
```

If you have no default value, or if you need to override it, you can supply another value.
```js
gulp.task('mytask', function() {
	gulp.src('./source/**/*')
		//  add the created myStream
		.pipe(myStream('welcome stranger'))  

		.pipe(gulp.dest('./destination'))
	;
});
```

You can provide any number of (default) arguments, just ensure the order remains the same.


## License
GPLv2 © [Konfirm ![Open](https://kon.fm/open.svg)](//kon.fm/site)
