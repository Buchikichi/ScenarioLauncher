/**
 * Enemy.
 */
function Enemy() {
	Actor.apply(this, arguments);
	this.score = 10;
}
Enemy.prototype = Object.create(Actor.prototype);
