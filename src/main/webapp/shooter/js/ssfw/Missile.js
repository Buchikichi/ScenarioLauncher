/**
 * Missile.
 */
function Missile(field, x, y, opt) {
	Actor.apply(this, arguments);
	this.dir = opt.dir;
	this.speed = 6;
	this.width = 8;
	this.height = 8;
	this.gravity = opt.gravity;
	this.recalculation();
}
Missile.prototype = Object.create(Actor.prototype);

Missile.prototype.fate = function() {
	this.x = this.field.width + this.width;
	this.isGone = true;
};

Missile.prototype.draw = function(ctx) {
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = 'rgba(200, 200, 255, 0.6)';
	ctx.arc(this.x, this.y, this.width / 3, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.restore();
	if (this.walled) {
//		if (this.walled == Landform.BRICK_TYPE.BRITTLE) {
//			this.field.landform.smashWall(this);
//		}
//		this.fate();
	}
};
