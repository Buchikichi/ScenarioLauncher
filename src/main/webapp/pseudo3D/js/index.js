$(document).ready(function() {
	var win = $(window);
	var body = $('body');
	var field = new Field();
	var hero = new Hero(field, 0, 0, 0);
	var sx = 0;
	var sy = 0;
	var which = 0;
	var canvas = $('#canvas');
//	var zoom = function() {
//		var magni = $('#magni').val();
//
//		field.magnification = magni;
//		field.draw();
//	}
//
//	$('#magni').on('change', zoom);
	var start = function(e) {
		var isMouse = e.type.match(/^mouse/);

		if (isMouse) {
			sx = e.offsetX;
			sy = e.offsetY;
		} else if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			sx = touches.pageX;
			sy = touches.pageY;
		}
		sx /= field.magni;
		sy /= field.magni;
		hero.setTargetX(sx - field.ox);
		hero.setTargetY(sy - field.oy);
		which = e.which;
	};
	var touch = function(e) {
		var isMouse = e.type.match(/^mouse/);
		var tx;
		var ty;

		if (isMouse) {
			if (!which) {
				return;
			}
			tx = e.offsetX;
			ty = e.offsetY;
		} else if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			tx = touches.pageX;
			ty = touches.pageY;
		}
		tx /= field.magni;
		ty /= field.magni;
		hero.setTargetX(tx - field.ox);
		hero.setTargetY(ty - field.oy);
		sx = tx;
		sy = ty;
	};
	var end = function(e) {
		hero.setTargetX(0);
		hero.setTargetY(0);
		which = 0;
	};

	canvas.mousedown(start);
	canvas.mousemove(touch);
	canvas.mouseleave(end);
	canvas.mouseup(end);
	canvas.bind('touchstart', start);
	canvas.bind('touchmove', touch);
	canvas.bind('touchend', end);
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

	field.addActor(hero);
	console.log('Ready!!!');
	activate(field);
});

/**
 * 実行.
 */
function activate(field) {
	setTimeout(function() {
		field.draw();
		activate(field);
	}, 33);
}
