/**
 * TitanShot.
 */
class TitanShot extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.dir = Math.PI;
		this.radian = this.dir;
		this.speed = 7;
		this.hitPoint = Number.MAX_SAFE_INTEGER;
		this.anim = new Animator(this, 'boss/titan/titan.shot.png', Animator.TYPE.NONE);
	}
}
