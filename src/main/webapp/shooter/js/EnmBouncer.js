/**
 * EnmBouncer.
 */
function EnmBouncer() {
	Enemy.apply(this, arguments);
	this.dx = -(Math.random() * 3 + 1);
	this.hitPoint = 3;
	this.score = 50;
	this.shuttle = parseInt(Math.random() * 4) + 1;
	this.img.src = 'img/enmBouncer.png';
}

EnmBouncer.prototype = Object.create(Enemy.prototype);

EnmBouncer.prototype._move = Enemy.prototype.move;
EnmBouncer.prototype.move = function(target) {
	if (this.shuttle && (this.x < 0 || this.field.width < this.x)) {
		this.dx = -this.dx;
		this.shuttle--;
	}
	if (this.isHitWall) {
		this.x = this.svX;
		this.y = this.svY;
	}
	if (this.field.height <= this.y || this.isHitWall) {
		this.dy = -this.dy;
	} else {
		this.dy += .3;
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
