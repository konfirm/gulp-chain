'use strict';

var through = require('through2');

/**
 *  Merge two different array(-like) variables where the first overrides the second
 *  @name    merge
 *  @access  internal
 *  @param   Array(-like) A
 *  @param   Array(-like) B
 *  @return  Array merged
 */
function merge(a, b) {
	var result = Array.prototype.slice.call(a),
		i;

	for (i = 0; i < b.length; ++i) {
		if (typeof result[i] === 'undefined' || result[i] === null) {
			result[i] = b[i];
		}
	}

	return result;
}

/**
 *  Prepare a gulp-plugin like chain function
 *  @name    chain
 *  @access  internal
 *  @param   variadic ...
 *  @return  function
 */
function chain() {
	var arg = Array.prototype.slice.call(arguments),
		pipe = arg.length > 0 ? arg.shift() : function(stream) {
			return stream;
		};

	return function() {
		var writer = through.obj(),
			chained = pipe.apply(null, [writer].concat(merge(arguments, arg))),
			wrapper = through.obj(function(chunk, enc, done) {
				writer.push(chunk);
				done();
			});

		chained.on('data', function(chunk) {
			wrapper.push(chunk);
		});

		return wrapper;
	};
}

//  expose the `chain` function
module.exports = chain;
