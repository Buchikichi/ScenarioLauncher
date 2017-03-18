/**
 * Twister.
 */
class Twister extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.hasBounds = false;
		this.dir = this.x <= 0 ? 0 : Math.PI;
		this.step = Math.PI / 23;
		this.speed = 3;
		this.score = 100;
		this.anim = new Animator(this, 'enemy/twister.png');
		this.routine = [
			new Movement(Twister.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L).add(Gizmo.TYPE.FIXED, Gizmo.DEST.ROTATE),
			new Movement(Twister.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R).add(Gizmo.TYPE.FIXED, Gizmo.DEST.ROTATE),
			new Movement(Twister.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R).add(Gizmo.TYPE.FIXED, Gizmo.DEST.ROTATE),
			new Movement(Twister.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L).add(Gizmo.TYPE.FIXED, Gizmo.DEST.ROTATE)
		];
	}
}
Twister.RANGE = 13;
