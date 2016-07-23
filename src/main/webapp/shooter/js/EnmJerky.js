/**
 * EnmJerky.
 */
function EnmJerky() {
	Enemy.apply(this, arguments);
	this.speed = 3;
	this.hitPoint = 1;
	this.score = 10;
	this.anim = new Animator(this, 'enmJerky.png', Animator.TYPE.NONE);
	this.routine = [
		new Movement(Movement.COND.X).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X),
		new Movement(Movement.COND.Y).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_Y)
	];
}
EnmJerky.prototype = Object.create(Enemy.prototype);
