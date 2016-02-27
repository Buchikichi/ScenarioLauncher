/**
 * Hero.
 */
function Hero(field, x, y) {
	Actor.apply(this, arguments);
	this.x = x;
	this.y = y;
	this.dx = 0;
	this.dy = 0;
	this.speed = 1;
	this.targetX = null;
	this.targetY = null;
	this.recalculation();
	this.img.src = 'img/hero001.png';
}
Hero.prototype = Object.create(Actor.prototype);

Hero.prototype.setTargetX = function(x) {
	this.targetX = x;
};
Hero.prototype.setTargetY = function(y) {
	this.targetY = y;
};
Hero.prototype.beforeMove = function() {
	if (this.targetX) {
		var diff = this.targetX - this.x - this.hW;
		var min = Math.min(Math.abs(diff), 16);

		if (min == 0) {
			this.x = this.targetX - this.hW;
			this.dx = 0;
			this.targetX = null;
		} else {
			var sign = diff < 0 ? -1 : 1;

			this.dx = sign * min;
		}
	}
	if (this.targetY) {
		var diff = this.targetY - this.y - this.hH;
		var min = Math.min(Math.abs(diff), 8);

		if (min == 0) {
			this.y = this.targetY - this.hH;
			this.dy = 0;
			this.targetY = null;
		} else {
			var sign = diff < 0 ? -1 : 1;

			this.dy = sign * min;
		}
	}
};
Hero.prototype.afterMove = function() {
	if (this.x < 0) {
		this.x = 0;
	} else if (this.maxX < this.x) {
		this.x = this.maxX;
	}
	if (this.y < 0) {
		this.y = 0;
	} else if (this.maxY < this.y) {
		this.y = this.maxY;
	}
};
