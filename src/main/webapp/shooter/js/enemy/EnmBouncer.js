/**
 * EnmBouncer.
 */
function EnmBouncer() {
	Enemy.apply(this, arguments);
	this.dir = this.x <= 0 ? 0 : Math.PI;
	this.speed = 2.5;
	this.gravity = .1;
	this.reaction = .95;
	this.hitPoint = 3;
	this.score = 50;
	this.shuttle = 2;
	this.img.src = 'img/enemy/bouncer.png';
}

EnmBouncer.prototype = Object.create(Enemy.prototype);

EnmBouncer.prototype._move = Enemy.prototype.move;
EnmBouncer.prototype.move = function(target) {
	if (this.shuttle && (this.x < 0 || this.field.width + Landform.BRICK_WIDTH < this.x)) {
		this.dir = Math.trim(this.dir + Math.PI);
		this.x = this.svX;
		this.dx = -this.dx;
		this.shuttle--;
	}
	if (this.walled) {
		this.x = this.svX;
		this.y = this.svY;
	}
	return this._move(target);
};

EnmBouncer.prototype.drawNormal = function(ctx) {
	var ay = Math.abs(this.dy);
	var sy = ay < 5 ? .75 + ay / 20 : 1;
	var ty = this.y / sy;

	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.scale(1, sy);
	ctx.drawImage(this.img, -this.hW, -this.hH);
	ctx.restore();
};
