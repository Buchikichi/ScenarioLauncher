/**
 * TitanShot.
 */
function TitanShot(field, x, y) {
	Enemy.apply(this, arguments);
	this.dir = Math.PI;
	this.radian = this.dir;
	this.speed = 14;
	this.hitPoint = Number.MAX_SAFE_INTEGER;
	this.anim = new Animator(this, 'boss/titan/titan.shot.png', Animator.TYPE.NONE);
}
TitanShot.prototype = Object.create(Enemy.prototype);
