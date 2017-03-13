/**
 * Bullet.
 */
class Bullet extends Actor {
	constructor(x, y) {
		super(x, y);
		this.speed = 2;
		this.width = 8;
		this.height = 8;
		this.recalculation();
	}

	draw(ctx) {
		if (this.walled) {
			this.eject();
			return;
		}
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = 'rgba(120, 200, 255, 0.7)';
		ctx.arc(this.x, this.y, this.width / 3, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.restore();
	}
}
