/**
 * EnmBouncer.
 */
function EnmBouncer() {
	Enemy.apply(this, arguments);
	this.dx = -(Math.random() * 3 + 1);
	this.hitPoint = 3;
	this.img = new Image();
	this.img.src = 'img/enmBouncer.png';
}

EnmBouncer.prototype = Object.create(Enemy.prototype);

EnmBouncer.prototype.movePlus = function() {
	if (this.x < 0 || 500 < this.x) {
		this.dx = -this.dx;
	}
	if (224 < this.y) {
		this.dy = -this.dy;
	} else {
		this.dy += .3;
	}
};

EnmBouncer.prototype.drawNormal = function(ctx) {
	var ay = Math.abs(this.dy);
	var sy = ay < 5 ? .75 + ay / 20 : 1;
	var ty = this.y / sy;

	ctx.save();
	ctx.scale(1, sy);
	ctx.drawImage(this.img, this.x, ty);
	ctx.restore();
};
