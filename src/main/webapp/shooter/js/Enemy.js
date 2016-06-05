/**
 * Enemy.
 */
function Enemy() {
	Actor.apply(this, arguments);
	this.score = 10;
	this.triggerCycle = 0;
}
Enemy.prototype = Object.create(Actor.prototype);

Enemy.TRIGGER_CYCLE = 30;

Enemy.prototype.trigger = function() {
	if (this.triggerCycle++ < Enemy.TRIGGER_CYCLE) {
		return false;
	}
	this.triggerCycle = 0;
	return true;
};
