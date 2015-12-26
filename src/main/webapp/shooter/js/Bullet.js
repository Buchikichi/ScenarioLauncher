/**
 * Bullet.
 */
function Bullet() {
	Actor.apply(this, arguments);
	this.speed = 2;
	this.width = 8;
	this.height = 8;
	this.maxX = this.field.width - this.width * 4;
	this.maxY = this.field.height - this.height;
}
Bullet.prototype = Object.create(Actor.prototype);

Bullet.prototype.aim = function(target) {
	var wX = this.x - target.x;
	var wY = this.y - target.y;

	this.radian = Math.atan2(wY, wX);
	this.dx = -Math.cos(this.radian) * this.speed;
	this.dy = -Math.sin(this.radian) * this.speed;
}

Bullet.prototype.drawNormal = function(ctx) {
	ctx.save();
	ctx.translate(this.width / 2, this.height / 2);
	ctx.beginPath();
	ctx.fillStyle = 'rgba(120, 200, 255, 0.7)';
	ctx.arc(this.x, this.y, this.width / 4, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.restore();
};

Bullet.prototype.drawExplosion = function(ctx) {
};
