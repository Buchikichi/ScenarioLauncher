/**
 * Waver.
 */
class Waver extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.dir = this.x <= 0 ? 0 : Math.PI;
		this.step = Math.PI / 60;
		this.speed = 2.5;
		this.score = 100;
		this.anim = new Animator(this, 'enemy/waver.png', Animator.TYPE.Y, 1, 8);
		this.routine = [
			new Movement(Waver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L),
			new Movement(Waver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
			new Movement(Waver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
			new Movement(Waver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L)
		];
	}
}
Waver.RANGE = 18;
