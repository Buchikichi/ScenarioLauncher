/**
 * Field.
 */
function Field() {
	this.id = '';
	this.bg = $('#bg');
	this.up = $('#upstairs');
	this.protagonist = new Actor('protagonist', 'chr001', 2);
	this.actors = [];
	this.events = {};
	this.wall = [];
	this.mapEvent = null;
	this.lastEvent = null;
}
Field.prototype.BRICK_WIDTH = 16;
Field.prototype.SCROLL_WIDTH = Field.prototype.BRICK_WIDTH * 4;
Field.prototype.SCROLL_HEIGHT = Field.prototype.BRICK_WIDTH * 2;

Field.prototype.change = function(mapId, x, y) {
	if (this.id == mapId) {
		this.jump(x, y);
	} else {
		this.loadMap(x, y);
		this.id = mapId;
	}
}
Field.prototype.loadMap = function(x, y) {
	var view = $('#view');
	var field = this;

	this.wall = [];
	view.fadeOut(function() {
		field.loadImage();
		$.ajax('/map/', {
			'type': 'POST',
			'data': {'mapId': field.id},
			'success': function(data) {
				var wall = data.wall;
				var pos = data.pos;
				var events = {};

				$.each(data.eventList, function(ix, ev) {
					events[ev.position] = ev.eventId;
				});
				field.height = wall.length;
				field.width = wall[0].length;
				field.wall = wall;
				field.events = events;
				view.fadeIn();
				field.jump(x, y);
			}
		});
	});
	$('.actor').each(function(ix, actor) {
		$(actor).remove();
	})
	field.actors = [];
}
Field.prototype.loadImage = function() {
	var bgUri = '/map/background/' + this.id;
	var upUri = '/map/upstairs/' + this.id;

	this.bg.css('background-image', 'url(' + bgUri + ')');
	this.up.css('background-image', 'url(' + upUri + ')');
}
Field.prototype.addActor = function(charId, charNum, mapX, mapY, ptn, ev) {
	var multiplicand = this.BRICK_WIDTH / this.protagonist.STRIDE;
	var x = mapX * multiplicand;
	var y = mapY * multiplicand;
	var actor = new Actor(charId, charNum, ptn, ev);

	actor.jump(x, y);
	this.actors.push(actor);
}
Field.prototype.jump = function(mapX, mapY) {
	var view = $('#view');
	var viewWidth = view.width() / this.protagonist.STRIDE;
	var viewHeight = view.height() / this.protagonist.STRIDE;
	var centerX = viewWidth / 2;
	var centerY = viewHeight / 2;
	var multiplicand = this.BRICK_WIDTH / this.protagonist.STRIDE;
	var x = mapX * multiplicand;
	var y = mapY * multiplicand;

	this.viewX = x - centerX;
	this.viewY = y - centerY;
	this.viewZ = 0;
	this.limitScroll();
	this.protagonist.jump(x, y);
	this.show();
	// event
	this.checkEvent(x, y);
	this.lastEvent = this.mapEvent;
	this.mapEvent = null;
}
Field.prototype.limitScroll = function() {
	var view = $('#view');
	var viewWidth = view.width() / this.protagonist.STRIDE;
	var viewHeight = view.height() / this.protagonist.STRIDE;
	var divisor = this.BRICK_WIDTH / this.protagonist.STRIDE;
	var maxX = this.width * divisor - viewWidth;
	var maxY = this.height * divisor - viewHeight;

	if (maxX < 0) {
		maxX = 0;
	}
	if (maxY < 0) {
		maxY = 0;
	}
	if (this.viewX < 0) {
		this.viewX = 0;
	} else if (maxX < this.viewX) {
		this.viewX = maxX;
	}
	if (this.viewY < 0) {
		this.viewY = 0;
	} else if (maxY < this.viewY) {
		this.viewY = maxY;
	}
}
Field.prototype.hitActor = function(x, y) {
	var field = this;
	var d = field.protagonist.d;
	var ev;

	$.each(this.actors, function(ix, actor) {
		if (actor.isHit(x, y, d)) {
			ev = actor.ev;
			return false;
		}
	});
	if (ev) {
		this.mapEvent = ev;
	}
	return ev;
}
Field.prototype.hitWall = function(x, y) {
	var divisor = this.BRICK_WIDTH / this.protagonist.STRIDE;
	var lx = parseInt(x / divisor);
	var rx = parseInt((x + 3) / divisor);
	var ty = parseInt(y / divisor) + 1;
	var by = parseInt((y + 1) / divisor) + 1;

	if (x < 0 || this.width <= rx || y < 0 || this.height <= by) {
		return true;
	}
	if (this.wall.length == 0) {
		return true;
	}
	var brickTL = this.wall[ty][lx];
	var brickTR = this.wall[ty][rx];
	var brickBL = this.wall[by][lx];
	var brickBR = this.wall[by][rx];

	return brickTL == 1 || brickTR == 1 || brickBL == 1 || brickBR == 1;
}
Field.prototype.checkEvent = function() {
	var x = this.protagonist.x;
	var y = this.protagonist.y;
	var divisor = this.BRICK_WIDTH / this.protagonist.STRIDE;
	var lx = parseInt(x / divisor);
	var rx = parseInt((x + 1) / divisor);
	var ty = parseInt(y / divisor);
	var position = lx + '-' + ty;
	var ev = this.events[position];

	if (!ev) {
		position = rx + '-' + ty;
		ev = this.events[position];
	}
	if (ev === this.lastEvent) {
		ev = null;
	} else {
		this.lastEvent = ev;
	}
	this.mapEvent = ev;
}
Field.prototype.scroll = function() {
	var view = $('#view');
	var top = (this.protagonist.y - this.viewY) * this.protagonist.STRIDE + this.BRICK_WIDTH;
	var left = (this.protagonist.x - this.viewX) * this.protagonist.STRIDE + this.BRICK_WIDTH;
	var centerX = view.width() / 2;
	var centerY = view.height() / 2;
	var dx = left - centerX;
	var dy = top - centerY;

	if (this.SCROLL_WIDTH < Math.abs(dx)) {
		if (dx < 0) {
			this.viewX--;
		} else if (0 < dx) {
			this.viewX++;
		}
	}
	if (this.SCROLL_HEIGHT < Math.abs(dy)) {
		if (dy < 0) {
			this.viewY--;
		} else if (0 < dy) {
			this.viewY++;
		}
	}
	this.limitScroll();
}
Field.prototype.show = function() {
	if (this.wall.length == 0) {
		return;
	}
	var vx = this.viewX * this.protagonist.STRIDE;
	var vy = this.viewY * this.protagonist.STRIDE;
	var position = -vx + 'px ' + -vy + 'px';

	this.bg.css('background-position', position);
	this.up.css('background-position', position);

	this.protagonist.show(this.viewX, this.viewY);

	// actor
	var field = this;
	$.each(this.actors, function(ix, actor) {
		actor.walk();
		if (typeof actor.x == 'undefined') {
			return;
		}
		if (field.hitWall(actor.x, actor.y)) {
			actor.back();
		}
		actor.show(field.viewX, field.viewY);
	})
}
