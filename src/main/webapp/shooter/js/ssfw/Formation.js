/**
 * Formation.
 */
class Formation extends Actor {
	constructor(x, y) {
		super(x, y);
		this.effectH = false;
		this.steps = 0;
		this.count = 0;
		this.enemies = [];
	}

	setup(type, num) {
		for (let ix = 0; ix < num; ix++) {
			let enemy = new type(this.x, this.y);

			if (!this.bonus) {
				this.score = enemy.score * 10;
				this.bonus = this.score;
			}
			this.enemies.push(enemy);
		}
		return this;
	}

	isDestroyed() {
		let enemies = [];

		this.enemies.forEach(enemy => {
			if (enemy.hitPoint == 0) {
				return;
			}
			enemies.push(enemy);
			this.x = enemy.x;
			this.y = enemy.y;
		});
		this.enemies = enemies;
		if (enemies.length == 0 && this.explosion == 0) {
			this.explosion = Actor.MAX_EXPLOSION * 4;
			return true;
		}
		return false;
	}

	move(target) {
		super.move(target);
		if (this.enemies.length <= this.count) {
			if (this.isDestroyed()) {
let capsules = [SpeedupCapsule, MissileCapsule];
let ix = Math.floor(Math.random() * capsules.length);
let capsule = capsules[ix];
				return [new capsule(this)];
			}
			return;
		}
		if (this.steps++ % Formation.STEP != 0) {
			return;
		}
		return [this.enemies[this.count++]];
	}

	drawExplosion(ctx) {
		ctx.fillStyle = 'rgba(240, 240, 255, .8)';
		ctx.fillText(this.bonus, 0, 0);
	}
}
Formation.STEP = 10;
