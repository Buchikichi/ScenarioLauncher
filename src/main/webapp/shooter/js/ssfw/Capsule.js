class Capsule extends Actor {
	constructor(target) {
		super(target.x, target.y, -1);
		this.region = new Region(this, 8);
		this.speed = 0;
//		this.routine = [
//			new Movement(Capsule.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L),
//			new Movement(Capsule.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
//			new Movement(Capsule.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
//			new Movement(Capsule.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L)
//		];
	}

	move(target) {
		super.move(target);
		if (this.region.isHit(target.region)) {
			this.fate(target);
		}
	}
}
Capsule.RANGE = 20;
