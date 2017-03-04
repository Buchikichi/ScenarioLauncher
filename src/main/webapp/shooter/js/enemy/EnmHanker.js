/**
 * EnmHanker.
 */
class EnmHanker extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.speed = 1.5;
		this.hitPoint = 2;
		this.score = 50;
		this.anim = new Animator(this, 'enemy/hanker.png', Animator.TYPE.NONE);
		this.routine = [
			new Movement().add(Gizmo.TYPE.AIM, Gizmo.DEST.ROTATE).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO)
		];
	}
}
