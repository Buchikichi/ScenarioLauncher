/**
 * Twister.
 */
function Twister() {
	Enemy.apply(this, arguments);
	this.margin = Field.HALF_WIDTH / 4;
	this.dir = this.x <= 0 ? 0 : Math.PI;
	this.step = Math.PI / 10;
	this.speed = 7;
	this.score = 100;
	this.anim = new Animator(this, 'enemy/twister.png', Animator.TYPE.NONE);
	this.routine = [
		new Movement(Twister.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L).add(Gizmo.TYPE.FIXED, Gizmo.DEST.ROTATE),
		new Movement(Twister.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R).add(Gizmo.TYPE.FIXED, Gizmo.DEST.ROTATE),
		new Movement(Twister.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R).add(Gizmo.TYPE.FIXED, Gizmo.DEST.ROTATE),
		new Movement(Twister.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L).add(Gizmo.TYPE.FIXED, Gizmo.DEST.ROTATE)
	];
}
Twister.prototype = Object.create(Enemy.prototype);
Twister.RANGE = 7;
