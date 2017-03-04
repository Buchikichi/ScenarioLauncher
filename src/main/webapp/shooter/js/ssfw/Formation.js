/**
 * Formation.
 */
class Formation extends Actor {
	constructor(field, x, y) {
		super(field, x, y);
		this.effectH = false;
		this.bonus = 800;
		this.score = this.bonus;
		this.steps = 0;
		this.count = 0;
		this.enemies = [];
	}

	setup(type, num) {
		for (var ix = 0; ix < num; ix++) {
			this.enemies.push(new type(this.field, this.x, this.y));
		}
		return this;
	}

	checkDestroy() {
		var formation = this;
		var enemies = [];

		this.enemies.forEach(function(enemy) {
			if (enemy.hitPoint == 0) {
				return;
			}
			enemies.push(enemy);
			formation.x = enemy.x;
			formation.y = enemy.y;
		});
		this.enemies = enemies;
		if (enemies.length == 0 && this.explosion == 0) {
			this.explosion = Actor.MAX_EXPLOSION * 4;
			return;
		}
	}

	move(target) {
		super.move(target);
		if (this.enemies.length <= this.count) {
			this.checkDestroy();
			return;
		}
		if (this.steps++ % Formation.STEP != 0) {
			return;
		}
		return [this.enemies[this.count++]];
	}

	drawExplosion(ctx) {
		ctx.fillStyle = 'rgba(240, 240, 255, .8)';
		ctx.fillText(this.bonus, this.x, this.y);
	}
}
Formation.STEP = 5;
