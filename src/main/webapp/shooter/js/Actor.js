/**
 * Actor.
 */
function Actor(field, x, y) {
	var actor = this;

	this.field = field;
	this.x = x;
	this.y = y;
	this.dx = 0;
	this.dy = 0;
	this.dir = null;
	this.radian = 0;
	this.width = 16;
	this.height = 16;
	this.speed = 1;
	this.hitPoint = 1;
	this.score = 0;
	this.minX = 0;
	this.minY = 0;
	this.maxX = this.field.width;
	this.maxY = this.field.height;
	this.recalculation();
	this.img = new Image();
	this.img.onload = function() {
		actor.width = this.width;
		actor.height = this.height;
		actor.recalculation();
	};
	this.sfx = new Audio();
	this.sfx.src = 'audio/sfx-explosion.mp3';
	this.sfx.volume = .4;
	this.absorb = new Audio();
	this.absorb.src = 'audio/sfx-absorb.mp3';
	this.absorb.volume = .3;
	this.enter();
}
Actor.MAX_EXPLOSION = 12;
Actor.PI2 = Math.PI * 2;
Actor.DEG_STEP = Math.PI / 180;

Actor.prototype.recalculation = function() {
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.minX = -this.width;
	this.minY = -this.height;
	this.maxX = this.field.width + this.width;
	this.maxY = this.field.height + this.height;
};

Actor.prototype.enter = function() {
	this.explosion = 0;
	this.isGone = false;
};

Actor.prototype.eject = function() {
	this.isGone = true;
	this.x = -this.field.width;
};

Actor.prototype.aim = function(target) {
	if (target) {
		var dist = this.calcDistance(target);

		if (this.speed < dist) {
			var dx = target.x - this.x;
			var dy = target.y - this.y;

			this.dir = Math.atan2(dy, dx);
		}
	} else {
		this.dir = null;
	}
};

Actor.prototype.trimRadian = function(radian) {
	if (Math.PI < radian) {
		return radian - Actor.PI2;
	} else if (radian < -Math.PI) {
		return radian + Actor.PI2;
	}
	return radian;
};

Actor.prototype.closeGap = function(target) {
	var dx = target.x - this.x;
	var dy = target.y - this.y;
	var diff = this.trimRadian(this.radian - Math.atan2(dy, dx));

	if (Math.abs(diff) <= Actor.DEG_STEP) {
		return 0;
	}
	if (0 < diff) {
		return -Actor.DEG_STEP;
	}
	return Actor.DEG_STEP;
};

/**
 * Move.
 * @param target
 */
Actor.prototype.move = function(target) {
	this.svX = this.x;
	this.svY = this.y;
	if (this.dir != null) {
		this.x += Math.cos(this.dir) * this.speed;
		this.y += Math.sin(this.dir) * this.speed;
	}
	this.x += this.dx * this.speed;
	this.y += this.dy * this.speed;
	if (this.x < this.minX || this.maxX < this.x) {
		this.eject();
	}
	if (this.y < this.minY || this.maxY < this.y) {
		this.eject();
	}
	if (0 < this.explosion) {
		this.explosion--;
		if (this.explosion == 0) {
			this.eject();
		}
	}
};

/**
 * Draw.
 * @param ctx
 */
Actor.prototype.drawNormal = function(ctx) {
	if (!this.img.src) {
		return;
	}
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.radian);
	ctx.drawImage(this.img, -this.hW, -this.hH);
	ctx.restore();
};

Actor.prototype.drawExplosion = function(ctx) {
	var size = this.explosion;

	ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.beginPath();
	ctx.arc(0, 0, size, 0, Actor.PI2, false);
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
	if (this.isGone || 0 < this.explosion || 0 < target.explosion) {
		return false;
	}
	var dist = this.calcDistance(target);
	var w = this.hW + target.hW;
	var h = this.hH + target.hH;
	var len = (w + h) / 3;

	if (dist < len) {
		this.fate(target);
		target.fate(this);
		return true;
	}
	return false;
};

Actor.prototype.calcDistance = function(target) {
	var wX = this.x - target.x;
	var wY = this.y - target.y;

	return Math.sqrt(wX * wX + wY * wY);
};

/**
 * やられ.
 */
Actor.prototype.fate = function(target) {
	this.hitPoint--;
	if (0 < this.hitPoint) {
		if (this.absorb) {
			var ctx = this.field.ctx;

			ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
			ctx.save();
			ctx.translate(target.x, target.y);
			ctx.beginPath();
			ctx.arc(0, 0, 5, 0, Actor.PI2, false);
			ctx.fill();
			ctx.restore();
			this.absorb.play();
		}
		return;
	}
	this.explosion = Actor.MAX_EXPLOSION;
	if (this.sfx) {
		this.sfx.play();
	}
};
