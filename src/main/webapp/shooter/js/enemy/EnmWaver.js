/**
 * EnmWaver.
 */
function EnmWaver() {
	Enemy.apply(this, arguments);
	this.dir = this.x <= 0 ? 0 : Math.PI;
	this.step = Math.PI / 30;
	this.speed = 4;
	this.score = 10;
	this.anim = new Animator(this, 'enmWaver.png', Animator.TYPE.Y, 1, 8);
	this.routine = [
		new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L),
		new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
		new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
		new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L)
	];
}
EnmWaver.prototype = Object.create(Enemy.prototype);
EnmWaver.RANGE = 8;
