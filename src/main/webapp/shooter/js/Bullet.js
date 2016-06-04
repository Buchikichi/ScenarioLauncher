/**
 * Bullet.
 */
function Bullet(field, x, y) {
	Actor.apply(this, arguments);
	this.speed = 4;
	this.width = 8;
	this.height = 8;
	this.recalculation();
}
Bullet.prototype = Object.create(Actor.prototype);

Bullet.prototype.aim = function(target) {
	var dx = target.x - this.x;
	var dy = target.y - this.y;

	this.dir = Math.atan2(dy, dx);
};

Bullet.prototype.drawNormal = function(ctx) {
	ctx.save();
	ctx.translate(this.hW, this.hH);
	ctx.beginPath();
	ctx.fillStyle = 'rgba(120, 200, 255, 0.7)';
	ctx.arc(this.x, this.y, this.width / 3, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.restore();
};

Bullet.prototype.drawExplosion = function(ctx) {
	// nop
};
