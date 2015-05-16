'use strict';

var Code = require('code'),
	Lab = require('lab'),
	through = require('through2'),
	chain = require('../lib/chain'),
	lab = exports.lab = Lab.script(),
	path;

//  we mimic gulp plugins by having functions which return a stream
function casing() {
	return through(function(chunk, enc, done) {
		var data = chunk.toString(),
			output = '',
			i;

		for (i = 0; i < data.length; ++i) {
			output += data[i][/[A-Z]/.test(data[i]) ? 'toLowerCase' : 'toUpperCase']();
		}

		this.push(output);

		done();
	});
}
function strip(n) {
	return through(function(chunk, end, done) {
		var data = chunk.toString().split('').filter(function(c, i) {
				return i % (n || 2) === 0;
			}).join('');

		this.push(data);

		done();
	});
}

lab.experiment('Chain', function() {

	lab.test('No arguments', function(done) {
		var empty = chain(),
			input = empty();

		input.on('data', function(data) {
			Code.expect(data).to.equal('hello world');

			done();
		});

		input.write('hello world');
	});

	lab.experiment('Arguments', function() {

		lab.test('Simple pipeline', function(done) {
			var piped = chain(function(stream) {
					return stream
						.pipe(casing())
					;
				}),
				input = piped();

			input.on('data', function(data) {
				Code.expect(String(data)).to.equal('HELLO WORLD');

				done();
			});

			input.write('hello world');
		});

		lab.test('Combined pipeline', function(done) {
			var piped = chain(function(stream) {
					return stream
						.pipe(casing())
						.pipe(strip())
					;
				}),
				input = piped();

			input.on('data', function(data) {
				Code.expect(String(data)).to.equal('HLOWRD');

				done();
			});

			input.write('hello world');
		});

		lab.test('Combined pipeline, add predefined argument', function(done) {
			var piped = chain(function(stream, n) {
					return stream
						.pipe(casing())
						.pipe(strip(n))
						.pipe(casing())
					;
				}, 3),
				input = piped();

			input.on('data', function(data) {
				Code.expect(String(data)).to.equal('hlwl');

				done();
			});

			input.write('hello world');
		});

		lab.test('Combined pipeline, add predefined argument, overrule it', function(done) {
			var piped = chain(function(stream, n) {
					return stream
						.pipe(casing())
						.pipe(strip(n))
						.pipe(casing())
					;
				}, 3),
				input = piped(4);

			input.on('data', function(data) {
				Code.expect(String(data)).to.equal('hor');

				done();
			});

			input.write('hello world');
		});

		lab.test('Combined pipeline, no predefined argument, provide it', function(done) {
			var piped = chain(function(stream, n) {
					return stream
						.pipe(casing())
						.pipe(strip(n))
						.pipe(casing())
					;
				}),
				input = piped(4);

			input.on('data', function(data) {
				Code.expect(String(data)).to.equal('hor');

				done();
			});

			input.write('hello world');
		});

	});

});
