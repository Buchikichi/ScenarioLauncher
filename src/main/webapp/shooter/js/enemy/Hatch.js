/**
 * Hatch.
 */
function Hatch() {
	Enemy.apply(this, arguments);
	this.z = 1;
	this.speed = 0;
	this.hitPoint = 10;
	this.score = 200;
	this.count = 0;
	this.children = 0;
	this.anim = new Animator(this, 'enemy/hatch.png', Animator.TYPE.Y, 1, 2);
	this.isInverse = false;
	if (this.field && this.field.landform) {
		var landform = this.field.landform;
		var src = {x:this.x, y:this.y + Landform.BRICK_WIDTH};

		landform.hitTest(src);
		this.isInverse = !src.walled;
	}
}
Hatch.prototype = Object.create(Enemy.prototype);
Hatch.IDLE = 30;
Hatch.INTERVAL = 8;
Hatch.CHILDREN = 20;

Hatch.prototype.enemy_move = Enemy.prototype.move;
Hatch.prototype.move = function(target) {
	this.enemy_move(target);

	if (this.count++ < Hatch.IDLE) {
		return;
	}
	if (this.count % Hatch.INTERVAL != 0) {
		return;
	}
	if (Hatch.CHILDREN <= this.children++) {
		return;
	}
	if (0 < this.explosion) {
		return;
	}
	return [new Charger(this.field, this.x, this.y)];
};
