/**
 * Hanker.
 */
class Hanker extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.speed = .7;
		this.hitPoint = 2;
		this.score = 50;
		this.anim = new Animator(this, 'enemy/hanker.png');
		this.routine = [
			new Movement().add(Gizmo.TYPE.AIM, Gizmo.DEST.ROTATE).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO)
		];
	}
}
