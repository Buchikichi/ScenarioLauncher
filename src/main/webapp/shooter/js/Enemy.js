/**
 * Enemy.
 */
function Enemy() {
	Actor.apply(this, arguments);
	this.dx = -4;
	this.dy = 0;
	this.width = 16;
	this.height = 16;
	this.score = 10;
}
Enemy.prototype = Object.create(Actor.prototype);
