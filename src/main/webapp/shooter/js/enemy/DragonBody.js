/**
 * DragonBody.
 */
function DragonBody() {
	Enemy.apply(this, arguments);
	this.effectH = false;
	this.effectV = false;
	this.hitPoint = Number.MAX_SAFE_INTEGER;
	this.score = 0;
	this.anim = new Animator(this, 'enemy/dragonBody.png', Animator.TYPE.NONE);
}

DragonBody.prototype = Object.create(Enemy.prototype);

DragonBody.prototype._recalculation = Actor.prototype.recalculation;
DragonBody.prototype.recalculation = function() {
	this._recalculation();
	this.minX = -this.field.width;
	this.minY = -this.field.height;
	this.maxX = this.field.width * 2;
	this.maxY = this.field.height * 2;
};

DragonBody.prototype.trigger = NOP;
