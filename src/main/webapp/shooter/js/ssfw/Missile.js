/**
 * Missile.
 */
class Missile extends Actor {
	constructor(x, y, opt) {
		super(x, y);
		this.dir = opt.dir;
		this.speed = 3;
		this.width = 2.5;
		this.gravity = opt.gravity;
		this.recalculation();
		this.fillStyle = 'rgba(200, 200, 255, 0.6)';
	}

//	move(target) {
//		super.move(target);
//		if (this.walled) {
//			if (this.walled == Landform.BRICK_TYPE.BRITTLE) {
//				Field.Instance.landform.smashWall(this);
//			}
//			this.fate();
//		}
//	}

	fate() {
		this.x = Field.Instance.width + this.width;
		this.isGone = true;
	}
}
