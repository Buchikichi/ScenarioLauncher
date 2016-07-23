/**
 * Missile.
 */
function Missile(field, x, y) {
	Actor.apply(this, arguments);
	this.dir = Math.PI / 10;
	this.speed = 6;
	this.width = 8;
	this.height = 8;
	this.recalculation();
}
Missile.prototype = Object.create(Actor.prototype);

Missile.prototype.draw = function(ctx) {
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = 'rgba(200, 200, 255, 0.6)';
	ctx.arc(this.x, this.y, this.width / 3, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.restore();
};
//
//Missile.prototype.drawExplosion = function(ctx) {
//	// nop
//};
