/**
 * Enemy.
 */
function Enemy() {
	Actor.apply(this, arguments);
	this.dx = -4;
	this.dy = 0;
	this.score = 10;
}
Enemy.prototype = Object.create(Actor.prototype);
