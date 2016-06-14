/**
 * Shooterメイン処理.
 */
var keys = {};
var phase = 0;
$(document).ready(function() {
	var view = $('#view');
	var field = new Field(512, 224);

	field.setup();
	loop(field);
	//
	$(window).keydown(function(e) {
		var ix = 'k' + e.keyCode;
		keys[ix] = e.keyCode;
//console.log(ix);
		if (!view.hasClass('addicting')) {
			view.addClass('addicting');
		}
	});
	$(window).keyup(function(e) {
		var ix = 'k' + e.keyCode;
		delete keys[ix];
	});
	var which = 0;
	var start = function(e) {
		var isMouse = e.type.match(/^mouse/);
		var tx;
		var ty;

		if (field.isGameOver()) {
			field.startGame();
			return;
		}
		if (isMouse) {
			tx = e.offsetX;
			ty = e.offsetY;
		} else if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			tx = touches.pageX;
			ty = touches.pageY;
		}
		field.moveShipTo({x:tx, y:ty});
		which = e.which;
	};
	var touch = function(e) {
		var isMouse = e.type.match(/^mouse/);
		var tx;
		var ty;

		view.removeClass('addicting');
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
		field.moveShipTo({x:tx, y:ty});
	};
	var end = function(e) {
		field.moveShipTo(null);
		which = 0;
	};
	view.mousedown(start);
	view.mousemove(touch);
	view.mouseleave(end);
	view.mouseup(end);
	view.bind('touchstart', start);
	view.bind('touchmove', touch);
	view.bind('touchend', end);
});
function loop(field) {
	field.inkey(keys);
	field.scroll();
	field.draw();
	setTimeout(function() {
		loop(field);
	}, 33);
}
/**
 * さいころ
 */
function die(max) {
	return parseInt(Math.random() * (max + 1)) == 0;
}
