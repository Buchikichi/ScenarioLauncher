$(document).ready(function() {
	init();
});
var STRIDE = 8;

/**
 * 初期処理.
 */
function init() {
	var field = new Field('map100');
	var view = $('#view');

	view.prop('field', field);
//	view.resizable();
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

	protagonist.width(width);
	protagonist.height(height);
	protagonist.css('background-image', 'url(/actor/image/chr001)');
	protagonist.css('top', (centerY - height / 2) + 'px');
	protagonist.css('left', (centerX - width / 2) + 'px');
	drawActor();
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

	if (isMouse && e.buttons == 0) {
		return;
	}
	var isTouch = e.type.match(/^touch/);
if (isTouch) {
console.log('type:' + e.type);
console.log(e);
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
	var field = view.prop('field');
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
	var ev = 0;

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
	ev = field.getEvent(x, y);
	if (field.hitWall(x, y)) {
		x = svX;
		hit = true;
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
		ev = field.getEvent(x, y);
		if (field.hitWall(x, y)) {
			y = svY;
			hit = true;
		}
	}
	if (!hit && x == svX && y == svY) {
		return false;
	}
	// event
	field.mapEvent = ev;

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
	if (move()) {
		var view = $('#view');
		var field = view.prop('field');
		var bg = $('#bg');
		var st = $('#upstairs');
		var vx = field.viewX * STRIDE;
		var vy = field.viewY * STRIDE;
		var position = -vx + 'px ' + -vy + 'px';

		bg.css('background-position', position);
		st.css('background-position', position);
		drawActor();
		doEvent();
	}
	setTimeout(function() {
		draw();
	}, 66);
}
function drawActor() {
	var view = $('#view');
	var field = view.prop('field');
	var protagonist = $('#protagonist');
	var bg = $('#bg');
	var top = (field.protagonist.y - field.viewY) * STRIDE;
	var left = (field.protagonist.x - field.viewX) * STRIDE;
	var d = field.protagonist.d;
	var s = field.protagonist.s;
	var posX = d * 64 + s * 32;
	var position = -posX + 'px 0px';

	protagonist.offset({ top: top, left: left });
	protagonist.css('background-position', position);
}
function doEvent() {
	var view = $('#view');
	var field = view.prop('field');
	var ev = field.mapEvent;

	if (!ev || ev == field.lastEvent) {
		return;
	}
	field.lastEvent = ev;
	field.mapEvent = null;
//	console.log('event:' + ev);
}
