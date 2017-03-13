/**
 * Shot.
 */
class Shot extends Actor {
	constructor(x, y) {
		super(x, y);
		this.dir = 0;
		this.width = 16;
		this.height = 8;
		this.recalculation();
		this.speed = 6;
		this.effectH = false;
		this.size = 2;
		this.maxX = Field.Instance.width;

		let pan = (this.x - Field.HALF_WIDTH) / Field.HALF_WIDTH;
		AudioMixer.INSTANCE.play('sfx-fire', .4, false, pan);
	}

	fate() {
		this.x = Field.Instance.width + this.width;
		this.isGone = true;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
		ctx.fill();
		if (this.walled) {
			if (this.walled == Landform.BRICK_TYPE.BRITTLE) {
				Field.Instance.landform.smashWall(this);
			}
			this.fate();
		}
	}
}
