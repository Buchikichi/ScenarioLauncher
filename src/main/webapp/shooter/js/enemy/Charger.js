/**
 * Charger.
 */
class Charger extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.speed = 2.5;
		this.hitPoint = 1;
		this.score = 10;
		this.anim = new Animator(this, 'enemy/charger.png');
		this.routine = [
			new Movement(Movement.COND.Y).add(Gizmo.TYPE.AIM, Gizmo.DEST.TO_Y).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_Y),
			new Movement(10).add(Gizmo.TYPE.AIM, Gizmo.DEST.TO_X).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X),
			new Movement(1000).add(Gizmo.TYPE.OWN, Gizmo.DEST.TO),
		];
	}
}
