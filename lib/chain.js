'use strict';

var through = require('through2'),
	duplexer = require('duplexer2');

/**
 *  Merge two different array(-like) variables where the first overrides the second
 *  @name    merge
 *  @access  internal
 *  @param   Array(-like) A
 *  @param   Array(-like) B
 *  @param   Array(-like) ...
 *  @return  Array merged
 */
function merge() {
	return Array.from(arguments)
		.reduce((result, current) => {
			Array.from(current)
				.forEach((value, index) => {
					result[index] = result[index] && typeof result[index] !== 'boolean' ? result[index] : value;
				});

			return result;
		}, []);
}

/**
 *  Prepare a gulp-plugin like chain function
 *  @name    chain
 *  @access  internal
 *  @param   variadic ...
 *  @return  function
 */
function chain() {
	let arg = Array.from(arguments),
		pipe = arg.length > 0 ? arg.shift() : stream => stream;

	return function() {
		let writer = through.obj();

		return duplexer(
			{objectMode: true},
			writer,
			pipe.apply(null, [writer].concat(merge(arguments, arg)))
		);
	};
}

//  expose the `chain` function
module.exports = chain;
