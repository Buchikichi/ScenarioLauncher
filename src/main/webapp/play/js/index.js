var mng;

$(document).ready(function() {
	mng = new SceneManager();
	init();
});
var STRIDE = 8;

/**
 * 初期処理.
 */
function init() {
	initProtagonist();
	initCover();
	draw();
}
function initProtagonist() {
	var view = $('#view');
	var centerX = view.width() / 2;
	var centerY = view.height() / 2;
	var width = 32;
	var height = 32;
	var protagonist = $('#protagonist');

	protagonist.css('top', (centerY - height / 2) + 'px');
	protagonist.css('left', (centerX - width / 2) + 'px');
}
function initCover() {
	var cover = $('#cover');

	cover.mousedown(touch);
	cover.mousemove(touch);
	cover.mouseup(leave);
	cover.mouseout(leave);
	cover.bind('touchstart', touch);
	cover.bind('touchmove', touch);
	cover.bind('touchend', leave);
}
function touch(e) {
	var view = $('#view');
	var isMouse = e.type.match(/^mouse/);

	if (mng.field.loading) {
		leave();
		return;
	}
	if (isMouse && e.buttons == 0) {
		return;
	}
	var isTouch = e.type.match(/^touch/);
	if (isTouch) {
		var px;
		var py;
		if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			px = touches.pageX;
			py = touches.pageY;
		} else {
			px = e.pageX;
			py = e.pageY;
		}
//		console.log('x:' + px + '/x:' + py);
//		console.log('type:' + e.type);
//		console.log(e);
		view.prop('touch', true);
		view.prop('touchX', px);
		view.prop('touchY', py);
		return;
	}
	view.prop('touch', true);
	view.prop('touchX', e.offsetX);
	view.prop('touchY', e.offsetY);
}
function leave() {
	var view = $('#view');

	view.prop('touch', false);
}
function move() {
	var view = $('#view');

	if (!view.prop('touch')) {
		return false;
	}
	var field = mng.field;
	var x = field.protagonist.x;
	var y = field.protagonist.y;
	var d = field.protagonist.d;
	var s = field.protagonist.s;
	var top = (field.protagonist.y - field.viewY) * STRIDE + field.BRICK_WIDTH;
	var left = (field.protagonist.x - field.viewX) * STRIDE + field.BRICK_WIDTH;
	var diffX = view.prop('touchX') - left;
	var diffY = view.prop('touchY') - top;
	var svX = x;
	var svY = y;
	var hit = false;

//console.log('x:' + x + '/y:' + y);
	if (field.BRICK_WIDTH < Math.abs(diffX)) {
		if (0 < x && diffX < 0) {
			x--;
			d = 1;
		} else if (0 < diffX) {
			x++;
			d = 2;
		}
	}
	if (x == svX) {
		if (field.BRICK_WIDTH < Math.abs(diffY)) {
			if (0 < y && diffY < 0) {
				y--;
				d = 3;
			} else {
				y++;
				d = 0;
			}
		}
	}
	if (field.hitWall(x, y)) {
		x = svX;
		y = svY;
		hit = true;
	}
	if (!hit && x == svX && y == svY) {
		return false;
	}

	// finish
	s = (++s) % 2;
	field.protagonist.x = x;
	field.protagonist.y = y;
	field.protagonist.d = d;
	field.protagonist.s = s;

	field.scroll();
	return true;
}
function draw() {
	if (!mng.isInEvent && !mng.isDialogOpen && move()) {
		mng.field.show();
		mng.verifyEvent();
	}
	setTimeout(function() {
		draw();
	}, 66);
}
