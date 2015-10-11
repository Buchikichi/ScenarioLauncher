$(document).ready(function() {
	init();
});
var STRIDE = 8;
var BRICK_WIDTH = 16;
var SCROLL_WIDTH = BRICK_WIDTH * 4;
var SCROLL_HEIGHT = BRICK_WIDTH * 2;

function Map(mapId) {
	this.id = mapId;
	this.bg = $('#bg');
	this.stair = $('#stair');
	this.loadImage();
	this.loadWall();
}
Map.prototype.load = function() {
}
Map.prototype.loadImage = function() {
	var bgUri = 'img/' + this.id + 'bg.png'
	this.bg.css('background-image', 'url(' + bgUri + ')');
	this.stair.css('background-image', 'url(img/map100st.png)');
}
Map.prototype.loadWall = function() {
	var params = {'method':'getWall', 'mapId':this.id};

	$.ajax('map', {
		'type': 'POST',
		'data': params,
		'success': this.loadWallSucceed
	});
}
Map.prototype.loadWallSucceed = function(data) {
	Map.prototype.height = data.length;
	Map.prototype.width = data[0].length;
	Map.prototype.wall = data;
	//console.log('loadWallSucceed');
}
Map.prototype.hitWall = function(x, y) {
	if (x < 0 || y < 0) {
		return true;
	}
	var divisor = BRICK_WIDTH / STRIDE;
	var lx = parseInt(x / divisor);
	var rx = parseInt((x + 3) / divisor);
	var ty = parseInt(y / divisor) + 1;
	var by = parseInt((y + 1) / divisor) + 1;
	var brickTL = this.wall[ty][lx];
	var brickTR = this.wall[ty][rx];
	var brickBL = this.wall[by][lx];
	var brickBR = this.wall[by][rx];

	return brickTL == 1 || brickTR == 1 || brickBL == 1 || brickBR == 1;
}



/**
 * 初期処理.
 */
function init() {
	var map = new Map('map100');
	var view = $('#view');
	var width = 320;
	var height = 240;

	view.width(width);
	view.height(height);
	view.prop('x', 0);
	view.prop('y', 0);
	view.prop('z', 0);
	view.prop('map', map);
//	view.resizable();
	initActor();
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
	actor.prop('x', 7);
	actor.prop('y', 14);
	actor.prop('d', 0); // direction
	actor.prop('s', 0); // step
	actor.css('background-image', 'url(img/chr001.png)');
	actor.css('top', (centerY - height / 2) + 'px');
	actor.css('left', (centerX - width / 2) + 'px');
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
	var vx = view.prop('x');
	var vy = view.prop('y');
	var map = view.prop('map');
	var actor = $('#actor');
	var x = actor.prop('x');
	var y = actor.prop('y');
	var d = actor.prop('d');
	var s = actor.prop('s');
	var acX = x * STRIDE + BRICK_WIDTH;
	var acY = y * STRIDE + BRICK_WIDTH;
	var diffX = acX - view.prop('touchX');
	var diffY = acY - view.prop('touchY');
	var svX = x;
	var svY = y;
	var hit = false;

	if (BRICK_WIDTH < Math.abs(diffX)) {
		if (diffX < 0) {
			x++;
			d = 2;
		} else {
			x--;
			d = 1;
		}
	}
	if (map.hitWall(vx + x, vy + y)) {
		x = svX;
		hit = true;
	}
	if (x == svX) {
		if (BRICK_WIDTH < Math.abs(diffY)) {
			if (diffY < 0) {
				y++;
				d = 0;
			} else {
				y--;
				d = 3;
			}
		}
		if (map.hitWall(vx + x, vy + y)) {
			y = svY;
			hit = true;
		}
	}
	if (!hit && x == svX && y == svY) {
		return false;
	}

	// scroll
	var centerX = view.width() / 2;
	var centerY = view.height() / 2;
	var diffPx = x * STRIDE - centerX;
	var diffPy = y * STRIDE - centerY;

	if (SCROLL_WIDTH < Math.abs(diffPx)) {
		if (0 < vx && diffPx < 0) {
			vx--;
			x = svX;
		} else if (0 < diffPx) {
			vx++;
			x = svX;
		}
		view.prop('x', vx);
	}
	if (SCROLL_HEIGHT < Math.abs(diffPy)) {
		if (0 < vy && diffPy < 0) {
			vy--;
			y = svY;
		} else if (0 < diffPy) {
			vy++;
			y = svY;
		}
		view.prop('y', vy);
	}

	// finish
	s = (++s) % 2;
	actor.prop('x', x);
	actor.prop('y', y);
	actor.prop('d', d);
	actor.prop('s', s);
	return true;
}
function draw() {
	if (move()) {
		var view = $('#view');
		var bg = $('#bg');
		var stair = $('#stair');
		var vx = view.prop('x') * STRIDE;
		var vy = view.prop('y') * STRIDE;
		var position = -vx + 'px ' + -vy + 'px';

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
	var bg = $('#bg');
	var x = actor.prop('x');
	var y = actor.prop('y');
	var top = y * STRIDE;
	var left = x * STRIDE;
	var d = actor.prop('d');
	var s = actor.prop('s');
	var posX = d * 64 + s * 32;
	var position = -posX + 'px 0px';

	actor.offset({ top: top, left: left });
	actor.css('background-position', position);
}
