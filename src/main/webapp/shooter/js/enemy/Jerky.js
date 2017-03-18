/**
 * Jerky.
 */
class Jerky extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.speed = 1;
		this.hitPoint = 1;
		this.score = 10;
		this.anim = new Animator(this, 'enemy/jerky.png');
		this.routine = [
			new Movement(Movement.COND.X).add(Gizmo.TYPE.AIM, Gizmo.DEST.TO_X).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X),
			new Movement(Movement.COND.Y).add(Gizmo.TYPE.AIM, Gizmo.DEST.TO_Y).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_Y)
		];
	}
}
