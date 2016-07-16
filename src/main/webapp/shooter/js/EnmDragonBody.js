/**
 * EnmDragonBody.
 */
function EnmDragonBody() {
	Enemy.apply(this, arguments);
	this.hitPoint = Number.MAX_SAFE_INTEGER;
	this.score = 0;
	this.img.src = 'img/enmDragonBody.png';
}

EnmDragonBody.prototype = Object.create(Enemy.prototype);

EnmDragonBody.prototype._recalculation = Actor.prototype.recalculation;
EnmDragonBody.prototype.recalculation = function() {
	this._recalculation();
	this.minX = -this.field.width;
	this.minY = -this.field.height;
	this.maxX = this.field.width * 2;
	this.maxY = this.field.height * 2;
};

EnmDragonBody.prototype.trigger = function() {
	// nop
};
