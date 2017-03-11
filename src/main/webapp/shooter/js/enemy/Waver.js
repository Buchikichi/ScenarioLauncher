/**
 * Waver.
 */
class Waver extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.dir = this.x <= 0 ? 0 : Math.PI;
		this.step = Math.PI / 60;
		this.speed = 2;
		this.score = 10;
		this.anim = new Animator(this, 'enemy/waver.png', Animator.TYPE.Y, 1, 8);
		this.routine = [
			new Movement(Waver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L),
			new Movement(Waver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
			new Movement(Waver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
			new Movement(Waver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L)
		];
	}
}
Waver.RANGE = 16;
