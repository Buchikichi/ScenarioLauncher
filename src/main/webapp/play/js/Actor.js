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
Actor.prototype.step = function() {
	this.s = (++this.s) % 2;
}
Actor.prototype.walk = function() {
	if (!this.isPlayer()) {
		this.cnt++;
		if (this.cnt < 5) {
			return;
		}
		this.cnt = 0;
	}
	// stride
	if (1 < this.ptn) {
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
	var top = (this.y - viewY) * this.STRIDE;
	var left = (this.x - viewX) * this.STRIDE;
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
	var hitY = y <= this.y && this.y <= y + 3;
	var isHit = hitX && hitY;

	if (isHit && this.ptn == 2) {
		this.d = 3 - d;
	}
	return isHit;
}
