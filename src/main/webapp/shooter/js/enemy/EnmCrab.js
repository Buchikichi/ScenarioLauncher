/**
 * EnmCrab.
 */
class EnmCrab extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.margin = Field.HALF_WIDTH;
		this.gravity = .3;
		this.reaction = .4;
		this.speed = 4;
		this.hitPoint = 1;
		this.score = 90;
		this.anim = new Animator(this, 'enemy/crab.png', Animator.TYPE.X, 8, 1);
		this.routine = [
			new Movement(Movement.COND.X).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X),
			new Movement(EnmCrab.WALK).add(Gizmo.TYPE.OWN, Gizmo.DEST.RIGHT),
			new Movement(Movement.COND.X).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X),
			new Movement(EnmCrab.WALK).add(Gizmo.TYPE.CHASE, Gizmo.DEST.LEFT),
		];
	}
}
EnmCrab.WALK = 20;
