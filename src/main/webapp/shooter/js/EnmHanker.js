/**
 * EnmHanker.
 */
function EnmHanker() {
	Enemy.apply(this, arguments);
	this.speed = 2;
	this.hitPoint = 8;
	this.score = 100;
	this.radian = 0;
	this.img.src = 'img/enmHanker.png';
}

EnmHanker.prototype = Object.create(Enemy.prototype);

EnmHanker.prototype.movePlus = function(target) {
	var wX = this.x - target.x;
	var wY = this.y - target.y;

	this.radian = Math.atan2(wY, wX);
	this.dx = -Math.cos(this.radian);
	this.dy = -Math.sin(this.radian);
};

EnmHanker.prototype.drawNormal = function(ctx) {
	ctx.save();
	ctx.translate(this.x + this.hW, this.y + this.hH);
	ctx.rotate(this.radian);
	ctx.drawImage(this.img, -this.hW, -this.hH);
	ctx.restore();
};
