/**
 * EnmJuno.
 */
function EnmJuno() {
	Enemy.apply(this, arguments);
	this.dir = Math.PI;
	this.speed = 2;
	this.effect = false;
	this.hitPoint = 75; // 2016-7-5
	this.score = 750;
	this.anim = new Animator(this, 'enmJuno.png', Animator.TYPE.NONE);
	this.routine = [
		new Movement().add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE)
	];
}
EnmJuno.prototype = Object.create(Enemy.prototype);

EnmJuno.prototype._recalculation = Actor.prototype.recalculation;
EnmJuno.prototype.recalculation = function() {
	this._recalculation();
	this.minX = -this.field.width;
	this.minY = -this.field.height;
	this.maxX = this.field.width * 2;
	this.maxY = this.field.height * 2;
};
