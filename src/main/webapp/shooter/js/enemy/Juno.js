/**
 * Juno.
 */
class Juno extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.hasBounds = false;
		this.dir = Math.PI;
		this.speed = 1;
		this.hitPoint = 16; // 2016-7-5
		this.score = 7500;
		this.anim = new Animator(this, 'enemy/juno.png');
		this.routine = [
			new Movement(200).add(Gizmo.TYPE.FIXED, Gizmo.DEST.TO),
			new Movement(Number.MAX_VALUE).add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE)
		];
	}
}
