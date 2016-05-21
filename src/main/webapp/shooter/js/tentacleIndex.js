$(document).ready(function() {
	var win = $(window);
	var keys = {};
	var body = $('body');
	var field = new Field();
	var which = 0;
	var canvas = $('#canvas');
	var activate = function() {
		setTimeout(function() {
			field.inkey(keys);
			field.draw();
			activate();
		}, 33);
	}

	win.resize(function() {
		var body = $('body');
		var header = $('#header');
		var height = body.height() - header.outerHeight(true);
		var magniH = body.width() / Field.WIDTH;
		var magniV = height / Field.HEIGHT;
		var magni = Math.min(magniH, magniV);

		field.resize(magni);
	});
	win.resize();
	win.keydown(function(e) {
		var ix = 'k' + e.keyCode;
		keys[ix] = e.keyCode;
//console.log(ix);
	});
	win.keyup(function(e) {
		var ix = 'k' + e.keyCode;
		delete keys[ix];
	});
	console.log('Ready!!!');
	activate();
});
