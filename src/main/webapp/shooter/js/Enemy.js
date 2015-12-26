/**
 * Enemy.
 */
function Enemy(x, y, type) {
	this.x = x;
	this.y = y;
	this.dx = -4;
	this.dy = 0;
	this.type = type;
	this.width = 16;
	this.height = 16;
	this.hitPoint = 1;
	this.steps = 0;
	this.explosion = 0;
}
Enemy.prototype.MAX_EXPLOSION = 12;

Enemy.prototype.fate = function() {
	this.explosion = this.MAX_EXPLOSION;
	this.sfx = new Audio();
	this.sfx.src = 'audio/sfx-explosion.mp3';
	this.sfx.volume = .4;
	this.sfx.play();
};

Enemy.prototype.isHit = function(target) {
	if (0 < this.explosion) {
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

Enemy.prototype.isGone = function() {
	if (this.explosion == 0) {
		return false;
	}
	this.explosion--;
	return this.explosion == 0;
};

Enemy.prototype.move = function(target) {
	this.x = this.x + this.dx;
	this.y = this.y + this.dy;
	this.movePlus(target);
};

Enemy.prototype.movePlus = function(target) {};

Enemy.prototype.drawNormal = function(ctx) {
	ctx.drawImage(this.img, this.x, this.y);
};

Enemy.prototype.drawExplosion = function(ctx) {
	var size = this.explosion;

	ctx.beginPath();
	ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
	ctx.arc(this.x, this.y, size, 0, Math.PI * 2, false);
	ctx.fill();
};

Enemy.prototype.draw = function(ctx) {
	if (0 < this.explosion) {
		this.drawExplosion(ctx);
	} else {
		this.drawNormal(ctx);
	}
};
