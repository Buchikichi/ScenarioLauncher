/**
 * Crab.
 */
class Crab extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.hasBounds = false;
		this.gravity = .3;
		this.reaction = .4;
		this.speed = 2;
		this.hitPoint = 1;
		this.score = 90;
		this.anim = new Animator(this, 'enemy/crab.png', Animator.TYPE.X | Animator.TYPE.ROTATION, 8, 1);
		this.routine = [
			new Movement(Movement.COND.X).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X),
			new Movement(Crab.WALK).add(Gizmo.TYPE.OWN, Gizmo.DEST.RIGHT),
			new Movement(Movement.COND.X).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X),
			new Movement(Crab.WALK).add(Gizmo.TYPE.CHASE, Gizmo.DEST.LEFT),
		];
	}
}
Crab.WALK = 20;
