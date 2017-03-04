/**
 * DragonBody.
 */
class DragonBody extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.effectH = false;
		this.effectV = false;
		this.hitPoint = Number.MAX_SAFE_INTEGER;
		this.score = 0;
		this.anim = new Animator(this, 'enemy/dragonBody.png', Animator.TYPE.NONE);
	}

	recalculation() {
		super.recalculation();
		this.minX = -this.field.width;
		this.minY = -this.field.height;
		this.maxX = this.field.width * 2;
		this.maxY = this.field.height * 2;
	};

	trigger() {}
}
