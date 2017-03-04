/**
 * EnmJuno.
 */
class EnmJuno extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.dir = Math.PI;
		this.speed = 3;
		this.hitPoint = 16; // 2016-7-5
		this.score = 750;
		this.anim = new Animator(this, 'enemy/juno.png', Animator.TYPE.NONE);
		this.routine = [
			new Movement(200).add(Gizmo.TYPE.FIXED, Gizmo.DEST.TO),
			new Movement(Number.MAX_VALUE).add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE)
		];
	}

	recalculation() {
		super.recalculation();
		this.minX = -this.field.width;
		this.minY = -this.field.height;
		this.maxX = this.field.width * 2;
		this.maxY = this.field.height * 2;
	}
}
