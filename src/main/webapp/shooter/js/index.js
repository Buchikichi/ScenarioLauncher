/**
 * Shooterメイン処理.
 */
document.addEventListener('DOMContentLoaded', function() {
	var view = document.getElementById('view');
	var field = new Field();
	var keys = {};

	window.addEventListener('keydown', function(event) {
		keys[event.key] = true;
//console.log('key[' + event.key + ']');
		if (!view.classList.contains('addicting')) {
			view.classList.add('addicting');
		}
	});
	window.addEventListener('keyup', function(event) {
		delete keys[event.key];
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

		view.classList.remove('addicting');
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
	view.addEventListener('mousedown', start);
	view.addEventListener('mousemove', touch);
	view.addEventListener('mouseleave', end);
	view.addEventListener('mouseup', end);
	view.addEventListener('touchstart', start);
	view.addEventListener('touchmove', touch);
	view.addEventListener('touchend', end);

	var activate = function() {
		field.inkey(keys);
		field.scroll();
		field.draw();
		setTimeout(activate, 33);
	};
	activate();
});
/**
 * さいころ
 */
function die(max) {
	return parseInt(Math.random() * (max + 1)) == 0;
}
