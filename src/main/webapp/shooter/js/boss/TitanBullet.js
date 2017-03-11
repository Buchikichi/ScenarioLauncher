/**
 * TitanBullet.
 */
class TitanBullet extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.dir = -Math.PI + Math.SQ / 2;
		this.radian = this.dir;
		this.speed = 4;
		this.hitPoint = Number.MAX_SAFE_INTEGER;
		this.anim = new Animator(this, 'boss/titan/titan.bullet.png', Animator.TYPE.NONE);
	}
	trigger() {}
}
