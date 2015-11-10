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
Field.prototype.DIVISOR = Field.prototype.BRICK_WIDTH / Actor.prototype.STRIDE;

Field.prototype.change = function(mapId, x, y) {
	if (this.id == mapId) {
		this.jump(x, y);
	} else {
		this.loadMap(x, y);
		this.id = mapId;
	}
}
Field.prototype.check = function(mapId, x, y) {
	this.change(mapId, x, y);
	this.protagonist.d = 0;
}
Field.prototype.loadMap = function(x, y) {
	var view = $('#view');
	var field = this;

	this.wall = [];
	view.fadeOut(function() {
		view.prop('show', false);
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
Field.prototype.getActor = function(charId) {
	var actor = null;
	$.each(this.actors, function(ix, obj) {
		if (obj.id == charId) {
			actor = obj;
			return false;
		}
	});
	return actor;
}
Field.prototype.removeActor = function(charId) {
	var actor = this.getActor(charId);

	if (actor != null) {
		actor.element.remove();
	}
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
	this.limitScroll();
	this.protagonist.jump(x, y);
	// event
	this.checkEvent(x, y);
	this.lastEvent = this.mapEvent;
	this.mapEvent = null;
}
Field.prototype.limitScroll = function() {
	var view = $('#view');
	var viewWidth = view.width() / this.protagonist.STRIDE;
	var viewHeight = view.height() / this.protagonist.STRIDE;
	var maxX = this.width * this.DIVISOR - viewWidth;
	var maxY = this.height * this.DIVISOR - viewHeight;

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
	var ev = '';

	$.each(this.actors, function(ix, actor) {
		if (actor.isHit(x, y, d)) {
			ev = actor.ev;
			return false;
		}
	});
	if (this.mapEvent == null) {
		this.mapEvent = ev;
	}
	return this.mapEvent;
}
Field.prototype.checkEvent = function() {
	var x = this.protagonist.x;
	var y = this.protagonist.y;
	var lx = parseInt(x / this.DIVISOR);
	var rx = parseInt((x + 1) / this.DIVISOR);
	var ty = parseInt(y / this.DIVISOR);
	var position = lx + '-' + ty;
	var ev = this.events[position];

	if (!ev) {
		position = rx + '-' + ty;
		ev = this.events[position];
	}
	this.mapEvent = ev;
}
Field.prototype.hitWall = function(x, y) {
	var lx = parseInt(x / this.DIVISOR);
	var mx = parseInt((x + 2) / this.DIVISOR);
	var rx = parseInt((x + 3) / this.DIVISOR);
	var ty = parseInt(y / this.DIVISOR) + 1;
	var by = parseInt((y + 1) / this.DIVISOR) + 1;

	if (x < 0 || this.width <= rx || y < 0 || this.height <= by) {
		return true;
	}
	if (this.wall.length == 0) {
		return true;
	}
	var brickTL = this.wall[ty][lx];
	var brickTM = this.wall[ty][mx];
	var brickTR = this.wall[ty][rx];
	var brickBL = this.wall[by][lx];
	var brickBR = this.wall[by][rx];

	return brickTL || brickTM || brickTR || brickBL || brickBR;
}
Field.prototype.hitEvent = function() {
	if (this.mapEvent === this.lastEvent) {
		this.mapEvent = null;
	} else {
		this.lastEvent = this.mapEvent;
	}
	return this.mapEvent;
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
	$('#view').fadeIn();
	// actor
	var field = this;
	$.each(this.actors, function(ix, actor) {
		actor.walk(field.protagonist);
		if (typeof actor.x == 'undefined') {
			return;
		}
		if (field.hitWall(actor.x, actor.y)) {
			actor.back();
		}
		actor.show(field.viewX, field.viewY);
	})
}
/**
 * 方向を求める.
 * @param sx start X
 * @param sy start Y
 * @param gx goal X
 * @param gy goal Y
 */
Field.prototype.getDirection = function(sx, sy, gx, gy) {
	var diffX = gx - sx;
	var diffY = gy - sy;
	var d = null;

	if (0 < Math.abs(diffX)) {
		if (diffX < 0) {
			d = 1;
		} else if (0 < diffX) {
			d = 2;
		}
	} else if (0 < Math.abs(diffY)) {
		if (diffY < 0) {
			d = 3;
		} else if (0 < diffY) {
			d = 0;
		}
	}
	return d;
}
/**
 * 方向を求める.
 * @param sx start X
 * @param sy start Y
 * @param gx goal X
 * @param gy goal Y
 */
Field.prototype.decideDirection = function(sx, sy, gx, gy) {
	var shadow = new Actor(null, null, 2);
	var goalNode = new AStarNode(gx, gy, 0, sx, sy);
	var keySet = [goalNode.getKey()];
	var nodeList = [goalNode];
	var min = 10000;
	var goal = null;

	for (var cnt = 0; cnt < 100; cnt++) {
		var newList = [];
		var nextMin = 10000;

		for (var ix = 0; ix < nodeList.length; ix++) {
			var node = nodeList[ix];

			if (min < node.s) {
				newList.push(node);
				continue;
			}
			for (var d = 0; d < 4; d++) {
				shadow.jump(node.x, node.y);
				shadow.d = d;
				shadow.walk();
				var x = shadow.x;
				var y = shadow.y;
				var isHit = this.hitWall(x, y);
	
				shadow.back();
				if (isHit) {
					continue;
				}
				var nextNode = new AStarNode(x, y, d, sx, sy);
				var key = nextNode.getKey();
				if (keySet.indexOf(key) != -1) {
					continue;
				}
				nextNode.setParent(node);
				keySet.push(key);
				newList.push(nextNode);
				if (x == sx && y == sy) {
					goal = nextNode;
					break;
				}
				if (nextNode.s < nextMin) {
					nextMin = nextNode.s;
				}
			}
			if (goal) {
				break;
			}
		}
		if (newList.length == 0 || goal) {
			break;
		}
		nodeList = newList;
		min = nextMin;
	}
//	console.log('----- goal:' + cnt);
	if (goal) {
//		var target = goal;
//		for (var ix = 0; ix < cnt; ix++) {
//			var x = target.x;
//			var y = target.y;
//
//			var act = new Actor('dummy' + ix, 'chr001', 2);
//			act.jump(x, y);
//			act.show(this.viewX, this.viewX);
//			console.log('target[' + x + ',' + y + ']c:' + target.c + '/s:' + target.s + '/h:' + target.h);
//			if (!target.parent) {
//				break;
//			}
//			target = $.extend(true, {}, target.parent);
//		}
		return 3 - goal.d;
	}
	return this.getDirection(sx, sy, gx, gy);
}
