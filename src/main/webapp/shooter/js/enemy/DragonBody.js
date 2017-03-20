/**
 * DragonBody.
 */
class DragonBody extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.region = new Region(this, 16);
		this.hasBounds = false;
		this.effectH = false;
		this.effectV = false;
		this.hitPoint = Number.MAX_SAFE_INTEGER;
		this.score = 0;
		this.anim = new Animator(this, 'enemy/dragonBody.png');
	}

	get triggered() {
		return false;
	}
}
