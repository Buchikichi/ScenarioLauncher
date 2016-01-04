/**
 * Bullet.
 */
function Bullet() {
	Actor.apply(this, arguments);
	this.speed = 2;
	this.width = 8;
	this.height = 8;
	this.recalculation();
}
Bullet.prototype = Object.create(Actor.prototype);

Bullet.prototype.aim = function(target) {
	var wX = target.x - this.x;
	var wY = target.y - this.y;
	var radian = Math.atan2(wY, wX);

	this.dx = Math.cos(radian) * this.speed;
	this.dy = Math.sin(radian) * this.speed;
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
};
