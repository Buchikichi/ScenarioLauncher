/**
 * TitanBullet.
 */
class TitanBullet extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.dir = -Math.PI + Math.SQ / 2;
		this.radian = this.dir;
		this.speed = 4;
		this.hitPoint = Number.MAX_SAFE_INTEGER;
		this.anim = new Animator(this, 'boss/titan/titan.bullet.png');
	}

	get triggered() {
		return false;
	}
}
