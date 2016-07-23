/**
 * EnmHanker.
 */
function EnmHanker() {
	Enemy.apply(this, arguments);
	this.speed = 1.5;
	this.hitPoint = 8;
	this.score = 100;
	this.anim = new Animator(this, 'enmHanker.png', Animator.TYPE.NONE);
	this.routine = [
		new Movement().add(Gizmo.TYPE.AIM, Gizmo.DEST.ROTATE).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO)
	];
}
EnmHanker.prototype = Object.create(Enemy.prototype);
