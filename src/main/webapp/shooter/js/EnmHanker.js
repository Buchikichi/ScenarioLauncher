/**
 * EnmHanker.
 */
function EnmHanker() {
	Enemy.apply(this, arguments);
	this.speed = 3;
	this.hitPoint = 8;
	this.score = 100;
	this.radian = 0;
	this.img.src = 'img/enmHanker.png';
}

EnmHanker.prototype = Object.create(Enemy.prototype);

EnmHanker.prototype.movePlus = function(target) {
	var wX = this.x - target.x;
	var wY = this.y - target.y;

	if (Math.abs(wX) < this.hW && Math.abs(wY) < this.hH) {
		return;
	}
	this.radian = Math.atan2(wY, wX);
	this.dx = -Math.cos(this.radian);
	this.dy = -Math.sin(this.radian);
};
