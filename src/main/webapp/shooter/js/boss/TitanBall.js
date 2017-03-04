/**
 * TitanBall.
 */
class TitanBall extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.margin = Field.HALF_WIDTH / 4;
		this.speed = 3 + Math.random() * 8;
		this.gravity = .04;
		this.hitPoint = 4;
		this.anim = new Animator(this, 'boss/titan/titan.ball.png', Animator.TYPE.NONE);
	}

	trigger() {}

	react() {
		super.react();
		this.fate(this);
	}
}
