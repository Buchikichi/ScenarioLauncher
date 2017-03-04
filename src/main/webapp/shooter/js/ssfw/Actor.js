class Matter {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.dx = 0;
		this.dy = 0;
		this.dir = null;
		this.radian = 0;
		this.width = 0;
		this.height = 0;
		this.gravity = 0;
		this.speed = 1;
	}
}

/**
 * Actor.
 */
class Actor extends Matter {
	constructor(field, x, y) {
		super();
		let actor = this;

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
		this.img.addEventListener('load', ()=> {
			this.width = this.img.width;
			this.height = this.img.height;
			this.recalculation();
		});
		this.sfx = 'sfx-explosion';
		this.sfxAbsorb = 'sfx-absorb';
		this.enter();
	}

	recalculation() {
		this.hW = this.width / 2;
		this.hH = this.height / 2;
		this.minX = -this.width - this.margin;
		this.minY = -this.height - this.margin;
		this.maxX = this.field.width + this.width + this.margin;
		this.maxY = this.field.height + this.height + this.margin;
	}

	enter() {
		this.explosion = 0;
		this.isGone = false;
	}

	eject() {
		this.isGone = true;
		this.x = -this.field.width;
	}

	aim(target) {
		if (target) {
			let dist = this.calcDistance(target);

			if (this.speed < dist) {
				let dx = target.x - this.x;
				let dy = target.y - this.y;

				this.dir = Math.atan2(dy, dx);
			}
		} else {
			this.dir = null;
		}
		return this;
	}

	closeGap(target) {
		let dx = target.x - this.x;
		let dy = target.y - this.y;
		let diff = Math.trim(this.radian - Math.atan2(dy, dx));

		if (Math.abs(diff) <= Actor.DEG_STEP) {
			return 0;
		}
		if (0 < diff) {
			return -Actor.DEG_STEP;
		}
		return Actor.DEG_STEP;
	}

	/**
	 * Move.
	 * @param target
	 */
	move(target) {
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
			let y = this.field.landform.scanFloor(this);
			let lift = false;

			if (this.gravity < 0) {
				y += this.hH;
				if (y < this.y) {
					this.dy += this.gravity;
				} else if (this.y < y) {
					lift = true;
				}
			} else {
				y -= this.hH;
				if (this.y < y) {
					this.dy += this.gravity;
				} else if (y < this.y) {
					lift = true;
				}
			}
			if (lift) {
				let diff = Math.abs(this.y - y);

				if (Landform.BRICK_WIDTH * 2 < diff) {
					this.dir = Math.trim(this.dir + Math.PI);
				} else {
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
	}

	react() {
		this.dy *= -this.reaction;
		this.radian = this.field.landform.getHorizontalAngle(this);
	}

	/**
	 * Draw.
	 * @param ctx
	 */
	drawNormal(ctx) {
		if (this.anim) {
			this.anim.draw(ctx);
		}
//		ctx.save();
//		ctx.translate(this.x, this.y);
//		ctx.fillStyle = 'white';
//		ctx.fillText(this.hitPoint, 0, 20);
//		ctx.restore();
	}

	drawExplosion(ctx) {
		let size = this.explosion;

		ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.arc(0, 0, size, 0, Math.PI2, false);
		ctx.fill();
		ctx.restore();
	}

	draw(ctx) {
		if (this.isGone) {
			return;
		}
		if (0 < this.explosion) {
			this.drawExplosion(ctx);
		} else {
			this.drawNormal(ctx);
		}
	}

	/**
	 * 当たり判定.
	 * @param target
	 * @returns {Boolean}
	 */
	isHit(target) {
		if (this.isGone || 0 < this.explosion || 0 < target.explosion) {
			return false;
		}
		let dist = this.calcDistance(target);
		let w = this.hW + target.hW;
		let h = this.hH + target.hH;
		let len = (w + h) / 3;

		if (dist < len) {
			this.fate(target);
			target.fate(this);
			return true;
		}
		return false;
	}

	calcDistance(target) {
		let wX = this.x - target.x;
		let wY = this.y - target.y;

		return Math.sqrt(wX * wX + wY * wY);
	}

	/**
	 * やられ.
	 */
	fate(target) {
		if (this.isGone || this.explosion) {
			return;
		}
		this.hitPoint--;
		if (0 < this.hitPoint) {
			this.absorb(target);
			return;
		}
		this.explosion = Actor.MAX_EXPLOSION;
		let pan = (this.x - Field.HALF_WIDTH) / Field.HALF_WIDTH;
		AudioMixer.INSTANCE.play(this.sfx, .2, false, pan);
	}

	absorb(target) {
		this.absorbed = true;
		if (this.sfxAbsorb) {
			let ctx = this.field.ctx;

			ctx.fillStyle = 'rgba(255, 200, 0, 0.4)';
			ctx.save();
			ctx.translate(target.x, target.y);
			ctx.beginPath();
			ctx.arc(0, 0, 5, 0, Math.PI2, false);
			ctx.fill();
			ctx.restore();
			let pan = (this.x - Field.HALF_WIDTH) / Field.HALF_WIDTH;
			AudioMixer.INSTANCE.play(this.sfxAbsorb, .3, false, pan);
		}
	}
}
Actor.MAX_EXPLOSION = 12;
Actor.DEG_STEP = Math.PI / 180;
