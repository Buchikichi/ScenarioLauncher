/**
 * Slur.
 */
class Slur extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.hasBounds = false;
		this.dir = this.x <= 0 ? 0 : Math.PI;
		this.step = Math.PI / 8;
		this.speed = 2;
		this.hitPoint = 3;
		this.score = 300;
		this.anim = new Animator(this, 'enemy/slur.png');
		this.routine = [
			new Movement(Slur.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L).add(Gizmo.TYPE.FIXED, Gizmo.DEST.ROTATE),
			new Movement(Slur.RANGE * 4).add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE),
			new Movement(Slur.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R).add(Gizmo.TYPE.FIXED, Gizmo.DEST.ROTATE),
			new Movement(Slur.RANGE * 4).add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE)
		];
	}
}
Slur.RANGE = 4;
