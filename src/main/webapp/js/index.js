$(document).ready(function() {
	init();
});

/**
 * 初期処理.
 */
function init() {
	var view = $('#view');
	var width = 320;
	var height = 240;

	view.width(width);
	view.height(height);
	view.prop('x', 0);
	view.prop('y', 0);
	view.prop('z', 0);
//	view.resizable();
	initActor();
	initBg();
	initCover();
	draw();
}
function initActor() {
	var view = $('#view');
	var centerX = view.width() / 2;
	var centerY = view.height() / 2;
	var width = 32;
	var height = 32;
	var actor = $('#actor');

	actor.width(width);
	actor.height(height);
	actor.prop('d', 0); // direction
	actor.prop('s', 0); // step
	actor.css('background-image', 'url(img/chr001.png)');
	actor.css('top', (centerY - height / 2) + 'px');
	actor.css('left', (centerX - width / 2) + 'px');
}
function initBg() {
	var bg = $('#bg');
	var stair = $('#stair');

	bg.css('background-image', 'url(img/bg.png)');
	stair.css('background-image', 'url(img/stair.png)');
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
	var actor = $('#actor');
	var centerX = view.width() / 2;
	var centerY = view.height() / 2;
	var diffX = centerX - view.prop('touchX');
	var diffY = centerY - view.prop('touchY');
	var d = actor.prop('d');
	var s = actor.prop('s');
	var x = view.prop('x');
	var y = view.prop('y');
	var svX = x;
	var svY = y;

	if (16 < Math.abs(diffX)) {
		if (diffX < 0) {
			x -= 8;
			d = 2;
		} else {
			x += 8;
			d = 1;
		}
	}
	if (16 < Math.abs(diffY)) {
		if (diffY < 0) {
			y -= 8;
			d = 0;
		} else {
			y += 8;
			d = 3;
		}
	}
	if (x == svX && y == svY) {
		return false;
	}
	s = (++s) % 2;
	actor.prop('d', d);
	actor.prop('s', s);
	view.prop('x', x);
	view.prop('y', y);
	return true;
}
function draw() {
	if (move()) {
		var view = $('#view');
		var bg = $('#bg');
		var stair = $('#stair');
		var x = view.prop('x');
		var y = view.prop('y');
		var position = x + 'px ' + y + 'px';

		bg.css('background-position', position);
		stair.css('background-position', position);
		drawActor();
	}
	setTimeout(function() {
		draw();
	}, 66);
}
function drawActor() {
	var actor = $('#actor');
	var d = actor.prop('d');
	var s = actor.prop('s');
	var x = d * 64 + s * 32;
	var position = -x + 'px 0px';

	actor.css('background-position', position);
}
