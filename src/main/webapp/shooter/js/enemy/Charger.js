/**
 * Charger.
 */
function Charger() {
	Enemy.apply(this, arguments);
	this.speed = 5;
	this.hitPoint = 1;
	this.score = 10;
	this.anim = new Animator(this, 'enemy/charger.png', Animator.TYPE.NONE);
	this.routine = [
		new Movement(Movement.COND.Y).add(Gizmo.TYPE.AIM, Gizmo.DEST.TO_Y).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_Y),
		new Movement(10).add(Gizmo.TYPE.AIM, Gizmo.DEST.TO_X).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X),
		new Movement(1000).add(Gizmo.TYPE.OWN, Gizmo.DEST.TO),
	];
}
Charger.prototype = Object.create(Enemy.prototype);
