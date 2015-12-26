/**
 * Actor.
 */
function Actor(field, x, y) {
	this.field = field;
	this.x = x;
	this.y = y;
	this.width = 16;
	this.height = 16;
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.speed = 1;
	this.hitPoint = 1;
	this.img = new Image();
	this.sfx = new Audio();
	this.sfx.src = 'audio/sfx-explosion.mp3';
	this.sfx.volume = .4;
	this.entry();
}
Actor.prototype.MAX_EXPLOSION = 12;

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

Actor.prototype.movePlus = function(target) {};

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
	var tx1 = target.x;
	var tx2 = tx1 + target.width;
	var ty1 = target.y;
	var ty2 = ty1 + target.height;
	var px2 = this.x + this.width;
	var py2 = this.y + this.height;
	var hitX = this.x <= tx1 && tx1 <= px2 || this.x <= tx2 && tx2 <= px2;
	var hitY = this.y <= ty1 && ty1 <= py2 || this.y <= ty2 && ty2 <= py2;

	if (hitX && hitY) {
		this.hitPoint--;
		if (this.hitPoint <= 0) {
			this.fate();
		}
		return true;
	}
	return false;
};

/**
 * やられ.
 */
Actor.prototype.fate = function() {
	this.explosion = this.MAX_EXPLOSION;
	this.sfx.play();
};
