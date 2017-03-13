/**
 * Missile.
 */
class Missile extends Actor {
	constructor(x, y, opt) {
		super(x, y);
		this.dir = opt.dir;
		this.speed = 3;
		this.width = 8;
		this.height = 8;
		this.gravity = opt.gravity;
		this.recalculation();
	}

	fate() {
		this.x = Field.Instance.width + this.width;
		this.isGone = true;
	}

	draw(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = 'rgba(200, 200, 255, 0.6)';
		ctx.arc(this.x, this.y, this.width / 3, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.restore();
//		if (this.walled) {
//			if (this.walled == Landform.BRICK_TYPE.BRITTLE) {
//				Field.Instance.landform.smashWall(this);
//			}
//			this.fate();
//		}
	}
}
