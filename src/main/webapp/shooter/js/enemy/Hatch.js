/**
 * Hatch.
 */
class Hatch extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.z = 1;
		this.speed = 0;
		this.hitPoint = 10;
		this.score = 200;
		this.count = 0;
		this.children = 0;
		this.anim = new Animator(this, 'enemy/hatch.png', Animator.TYPE.Y, 1, 2);
		this.isInverse = false;
		if (this.field && this.field.landform) {
			var landform = this.field.landform;
			var src = {x:this.x, y:this.y + Landform.BRICK_WIDTH};

			landform.hitTest(src);
			this.isInverse = !src.walled;
		}
	}

	move(target) {
		super.move(target);

		if (this.count++ < Hatch.IDLE) {
			return;
		}
		if (this.count % Hatch.INTERVAL != 0) {
			return;
		}
		if (Hatch.CHILDREN <= this.children++) {
			return;
		}
		if (0 < this.explosion) {
			return;
		}
		return [new Charger(this.field, this.x, this.y)];
	}
}
Hatch.IDLE = 30;
Hatch.INTERVAL = 8;
Hatch.CHILDREN = 20;
