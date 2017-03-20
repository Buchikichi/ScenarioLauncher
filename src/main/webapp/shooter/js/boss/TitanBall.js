/**
 * TitanBall.
 */
class TitanBall extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.hasBounds = false;
		this.speed = 1.5 + Math.random() * 4;
		this.gravity = .03;
		this.hitPoint = 4;
		this.anim = new Animator(this, 'boss/titan/titan.ball.png');
	}

	get triggered() {
		return false;
	}

	reactY(y) {
		super.reactY(y);
		this.fate(this);
	}
}
