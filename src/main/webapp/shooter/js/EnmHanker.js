/**
 * EnmHanker.
 */
function EnmHanker() {
	Enemy.apply(this, arguments);
	this.hitPoint = 8;
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.radian = 0;
	this.img = new Image();
	this.img.src = 'img/enmHanker.png';
}

EnmHanker.prototype = Object.create(Enemy.prototype);

EnmHanker.prototype.SPEED = 2;

EnmHanker.prototype.movePlus = function(target) {
	var wX = this.x - target.x;
	var wY = this.y - target.y;

	this.radian = Math.atan2(wY, wX);
	this.dx = -Math.cos(this.radian) * this.SPEED;
	this.dy = -Math.sin(this.radian) * this.SPEED;
};

EnmHanker.prototype.drawNormal = function(ctx) {
	ctx.save();
	ctx.translate(this.x + this.hW, this.y + this.hH);
	ctx.rotate(this.radian);
	ctx.drawImage(this.img, -this.hW, -this.hH);
	ctx.restore();
};
