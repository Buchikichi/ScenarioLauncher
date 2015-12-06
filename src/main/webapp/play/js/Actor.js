/**
 * Actor.
 */
function Actor(charId, charNum, pattern, event) {
	this.id = charId;
	this.num = charNum;
	this.ptn = pattern;
	this.ev = event;
	this.d = 0; // direction
	this.s = 0; // step
	this.cnt = 0; // walking

	if (!charId) {
		return;
	}
	var div = $('#' + charId);
	if (div.length == 0) {
		div = $('<div></div>');
		div.attr('id', charId);
		div.addClass('actor');
		$('#view').append(div);
		this.makeDecision();
	}
	this.element = div;
	this.element.hide();
	this.element.css('background-image', 'url(/actor/image/' + this.num + ')');
}
Actor.prototype.STRIDE = 8;

Actor.prototype.isPlayer = function() {
	return (this.ev == null || typeof this.ev == 'undefined')
}
Actor.prototype.jump = function(x, y) {
	this.x = x;
	this.y = y;
	this.svX = x;
	this.svY = y;
}
Actor.prototype.makeDecision = function() {
	if (this.isPlayer()) {
		return;
	}
	this.d = parseInt(Math.random() * 4);
	this.distance = Math.random() * 20;
	this.cnt = 0;
}
/**
 * 方向を求める.
 * @param gx goal X
 * @param gy goal Y
 */
Actor.prototype.getDirection = function(gx, gy) {
	var diffX = gx - this.x;
	var diffY = gy - this.y;
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
Actor.prototype.chase = function(field, gx, gy) {
	var shadow = new Actor(null, null, 2);
	var goalNode = new AStarNode(gx, gy, 0, this.x, this.y);
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
				var isHit = field.hitWall(x, y);
	
				shadow.back();
				if (isHit) {
					continue;
				}
				var nextNode = new AStarNode(x, y, d, this.x, this.y);
				var key = nextNode.getKey();
				if (keySet.indexOf(key) != -1) {
					continue;
				}
				nextNode.setParent(node);
				keySet.push(key);
				newList.push(nextNode);
				if (x == this.x && y == this.y) {
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
	return this.getDirection(gx, gy);
}
Actor.prototype.step = function() {
	this.s = (++this.s) % 2;
}
Actor.prototype.walk = function(field) {
	if (!this.isPlayer()) {
		this.cnt++;
		if (this.cnt < 5) {
			return;
		}
		this.cnt = 0;
	}
	// stride
	if (1 < this.ptn) {
		if (this.ptn == 7) {
			var player = field.protagonist;
			this.d = this.chase(field, player.x, player.y);
		}
		if (this.d == 0) {
			this.y++;
		} else if (this.d == 1) {
			this.x--;
		} else if (this.d == 2) {
			this.x++;
		} else if (this.d == 3) {
			this.y--;
		}
		this.distance--;
		if (this.distance <= 0) {
			this.makeDecision();
		}
	}
	this.step();
}
Actor.prototype.isMove = function() {
	return (this.x != this.svX || this.y != this.svY);
}
Actor.prototype.back = function() {
	this.x = this.svX;
	this.y = this.svY;
	this.makeDecision();
}
Actor.prototype.show = function(viewX, viewY) {
	var viewOffset = $('#bg').offset();
	var vLeft = viewOffset.left;
	var vTop = viewOffset.top;
	var top = vTop + (this.y - viewY) * this.STRIDE;
	var left = vLeft + (this.x - viewX) * this.STRIDE;
	var posX = this.d * 64 + this.s * 32;
	var position = -posX + 'px 0px';

	this.svX = this.x;
	this.svY = this.y;
	this.element.offset({ top: top, left: left });
	this.element.css('background-position', position);
	this.element.css('z-index', 1000 + this.y);
	this.element.show();
}
Actor.prototype.isHit = function(x, y, d) {
	var hitX = x - 2 <= this.x && this.x <= x + 2;
	var hitY = y - 1 <= this.y && this.y <= y + 1;
	var isHit = hitX && hitY;

	if (isHit && this.ptn == 2) {
		this.d = 3 - d;
	}
	return isHit;
}
Actor.prototype.turnLeft = function() {
	if (this.d == 0) {
		this.d = 2;
	} else if (this.d == 1) {
		this.d = 0;
	} else if (this.d == 2) {
		this.d = 3;
	} else {
		this.d = 1;
	}
}
