/**
 * Actor.
 */
function Actor(x, y, field, imgsrc) {
	Esse.apply(this, arguments);
	var actor = this;

	this.field = field;
	this.dx = 0;
	this.dy = 0;
	this.width = 16;
	this.height = 16;
	this.speed = 3;
	this.img = new Image();
	this.img.onload = function() {
		actor.width = this.width;
		actor.height = this.height;
		actor.recalculation();
	};
	this.img.src = imgsrc;
}
Actor.prototype = Object.create(Esse.prototype);

Actor.prototype.recalculation = function() {
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.maxX = this.field.width;
	this.maxY = this.field.height;
};

/**
 * Move.
 * @param target
 */
Actor.prototype.move = function(target) {
	this.svX = this.x;
	this.svY = this.y;
	this.x += this.dx * this.speed;
	this.y += this.dy * this.speed;
};

Actor.prototype.draw = function(ctx) {
	var x = this.x - this.hW;
	var y = this.y - this.hH;

	ctx.drawImage(this.img, x, y);
};

/**
 * 当たり判定.
 * @param target
 * @returns {Boolean}
 */
Actor.prototype.isHit = function(target) {
	if (this.isGone || 0 < this.explosion) {
		return false;
	}
	var dist = this.calcDistance(target);
	var w = this.hW + target.hW;
	var h = this.hH + target.hH;
	var len = (w + h) / 3;

	if (dist < len) {
		this.fate();
		target.fate();
		return true;
	}
	return false;
};

Actor.prototype.calcDistance = function(target) {
	var wX = this.x + this.hW - target.x - target.hW;
	var wY = this.y + this.hH - target.y - target.hH;

	return Math.sqrt(wX * wX + wY * wY);
};
