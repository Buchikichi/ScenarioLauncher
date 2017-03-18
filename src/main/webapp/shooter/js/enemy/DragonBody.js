/**
 * DragonBody.
 */
class DragonBody extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.effectH = false;
		this.effectV = false;
		this.hitPoint = Number.MAX_SAFE_INTEGER;
		this.score = 0;
		this.anim = new Animator(this, 'enemy/dragonBody.png');
	}

	recalculation() {
		let field = Field.Instance;
		super.recalculation();
		this.minX = -field.width;
		this.minY = -field.height;
		this.maxX = field.width * 2;
		this.maxY = field.height * 2;
	};

	trigger() {}
}
