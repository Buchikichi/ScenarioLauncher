/**
 * TitanBullet.
 */
function TitanBullet(field, x, y) {
	Enemy.apply(this, arguments);
	this.dir = -Math.PI + Math.SQ / 2;
	this.radian = this.dir;
	this.speed = 10;
	this.hitPoint = Number.MAX_SAFE_INTEGER;
	this.anim = new Animator(this, 'boss/titan/titan.bullet.png', Animator.TYPE.NONE);
}
TitanBullet.prototype = Object.create(Enemy.prototype);
