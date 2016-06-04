/**
 * EnmHanker.
 */
function EnmHanker() {
	Enemy.apply(this, arguments);
	this.speed = 3;
	this.hitPoint = 8;
	this.score = 100;
	this.img.src = 'img/enmHanker.png';
}

EnmHanker.prototype = Object.create(Enemy.prototype);

EnmHanker.prototype.movePlus = function(target) {
	var wX = this.x - target.x;
	var wY = this.y - target.y;

	this.radian = Math.atan2(wY, wX);
	this.dir = this.radian - Math.PI;
};
