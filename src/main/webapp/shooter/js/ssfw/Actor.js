/**
 * Actor.
 */
function Actor(field, x, y) {
	var actor = this;

	this.field = field;
	this.x = x;
	this.y = y;
	this.z = 0;
	this.dx = 0;
	this.dy = 0;
	this.dir = null;
	this.radian = 0;
	this.width = 16;
	this.height = 16;
	this.margin = 0;
	this.gravity = 0;
	this.reaction = 0;
	this.speed = 1;
	this.effectH = true;
	this.effectV = true;
	this.hitPoint = 1;
	this.absorbed = false;
	this.score = 0;
	this.walled = false;
	this.recalculation();
	this.img = new Image();
	this.img.onload = function() {
		actor.width = this.width;
		actor.height = this.height;
		actor.recalculation();
	};
	this.sfx = 'sfx-explosion';
	this.sfxAbsorb = 'sfx-absorb';
	this.enter();
}
Actor.MAX_EXPLOSION = 12;
Actor.DEG_STEP = Math.PI / 180;

Actor.prototype.recalculation = function() {
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.minX = -this.width - this.margin;
	this.minY = -this.height - this.margin;
	this.maxX = this.field.width + this.width + this.margin;
	this.maxY = this.field.height + this.height + this.margin;
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
	return this;
};

Actor.prototype.closeGap = function(target) {
	var dx = target.x - this.x;
	var dy = target.y - this.y;
	var diff = Math.trim(this.radian - Math.atan2(dy, dx));

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
	if (0 < this.explosion) {
		this.explosion--;
		if (this.explosion == 0) {
			this.eject();
			return;
		}
	}
	this.svX = this.x;
	this.svY = this.y;
	if (this.dir != null) {
		this.x += Math.cos(this.dir) * this.speed;
		this.y += Math.sin(this.dir) * this.speed;
	}
	if (this.gravity != 0) {
		var y = this.field.landform.scanFloor(this);

		if (this.gravity < 0) {
			y += this.hH;
			if (y < this.y) {
				this.dy += this.gravity;
			} else if (this.y < y) {
				this.y = y;
				this.react();
			}
		} else {
			y -= this.hH;
			if (this.y < y) {
				this.dy += this.gravity;
			} else if (y < this.y) {
				this.y = y;
				this.react();
			}
		}
	}
	this.x += this.dx * this.speed;
	this.y += this.dy * this.speed;
	if (this.anim) {
		this.anim.next(this.dir);
	}
};

Actor.prototype.react = function() {
	this.dy *= -this.reaction;
	this.radian = this.field.landform.getHorizontalAngle(this);
};

/**
 * Draw.
 * @param ctx
 */
Actor.prototype.drawNormal = function(ctx) {
	if (this.anim) {
		this.anim.draw(ctx);
	}
//	ctx.save();
//	ctx.translate(this.x, this.y);
//	ctx.fillStyle = 'white';
//	ctx.fillText(this.hitPoint, 0, 20);
//	ctx.restore();
};

Actor.prototype.drawExplosion = function(ctx) {
	var size = this.explosion;

	ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.beginPath();
	ctx.arc(0, 0, size, 0, Math.PI2, false);
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
	if (this.isGone || this.explosion) {
		return;
	}
	this.hitPoint--;
	if (0 < this.hitPoint) {
		this.absorb(target);
		return;
	}
	this.explosion = Actor.MAX_EXPLOSION;
	var pan = (this.x - Field.HALF_WIDTH) / Field.HALF_WIDTH;
	AudioMixer.INSTANCE.play(this.sfx, .2, false, pan);
};


Actor.prototype.absorb = function(target) {
	this.absorbed = true;
	if (this.sfxAbsorb) {
		var ctx = this.field.ctx;

		ctx.fillStyle = 'rgba(255, 200, 0, 0.4)';
		ctx.save();
		ctx.translate(target.x, target.y);
		ctx.beginPath();
		ctx.arc(0, 0, 5, 0, Math.PI2, false);
		ctx.fill();
		ctx.restore();
		var pan = (this.x - Field.HALF_WIDTH) / Field.HALF_WIDTH;
		AudioMixer.INSTANCE.play(this.sfxAbsorb, .3, false, pan);
	}
};

function NOP() {};
