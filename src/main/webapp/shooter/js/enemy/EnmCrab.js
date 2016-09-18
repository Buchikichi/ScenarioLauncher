/**
 * EnmCrab.
 */
function EnmCrab() {
	Enemy.apply(this, arguments);
	this.gravity = .3;
	this.reaction = .4;
	this.speed = 1.5;
	this.hitPoint = 1;
	this.score = 90;
	this.anim = new Animator(this, 'enemy/crab.png', Animator.TYPE.X, 8, 1);
	this.routine = [
		new Movement().add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X)
	];
}
EnmCrab.prototype = Object.create(Enemy.prototype);
