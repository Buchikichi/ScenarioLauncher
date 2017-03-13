/**
 * EnmJuno.
 */
class EnmJuno extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.dir = Math.PI;
		this.speed = 1.5;
		this.hitPoint = 16; // 2016-7-5
		this.score = 750;
		this.anim = new Animator(this, 'enemy/juno.png', Animator.TYPE.NONE);
		this.routine = [
			new Movement(200).add(Gizmo.TYPE.FIXED, Gizmo.DEST.TO),
			new Movement(Number.MAX_VALUE).add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE)
		];
	}

	recalculation() {
		let field = Field.Instance;
		super.recalculation();
		this.minX = -field.width;
		this.minY = -field.height;
		this.maxX = field.width * 2;
		this.maxY = field.height * 2;
	}
}
