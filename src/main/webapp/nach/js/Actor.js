/**
 * Actor.
 */
function Actor(field, x, y) {
	this.field = field;
	this.x = x;
	this.y = y;
	this.width = 16;
	this.height = 16;
	this.speed = 1;
	this.hitPoint = 1;
	this.recalculation();
	this.img = new Image();
	this.sfx = new Audio();
//	this.sfx.src = 'audio/sfx-explosion.mp3';
//	this.sfx.volume = .4;
	this.entry();
}
Actor.prototype.MAX_EXPLOSION = 12;

Actor.prototype.recalculation = function() {
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.maxX = this.field.width;
	this.maxY = this.field.height;
};

Actor.prototype.entry = function() {
	this.explosion = 0;
	this.isGone = false;
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
	this.movePlus(target);
	if (0 < this.explosion) {
		this.explosion--;
		if (this.explosion == 0) {
			this.isGone = true;
		}
	}
};

Actor.prototype.movePlus = function(target) {
	if (this.x + this.width < 0 || this.field.width < this.x) {
		this.isGone = true;
	}
	if (this.y + this.height < 0 || this.field.height < this.y) {
		this.isGone = true;
	}
};

/**
 * Draw.
 * @param ctx
 */
Actor.prototype.drawNormal = function(ctx) {
	ctx.drawImage(this.img, this.x, this.y);
};

Actor.prototype.drawExplosion = function(ctx) {
	var size = this.explosion;

	ctx.save();
	ctx.translate(this.width / 2, this.height / 2);
	ctx.beginPath();
	ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
	ctx.arc(this.x, this.y, size, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.restore();
};

Actor.prototype.draw = function(ctx) {
	if (this.isGone) {
		return;
	}
	if (0 < this.explosion) {
		this.drawExplosion(ctx);
	} else {
		this.drawNormal(ctx);
	}
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

/**
 * やられ.
 */
Actor.prototype.fate = function() {
	this.hitPoint--;
	if (0 < this.hitPoint) {
		return;
	}
	this.explosion = this.MAX_EXPLOSION;
	if (this.sfx) {
		this.sfx.play();
	}
};
