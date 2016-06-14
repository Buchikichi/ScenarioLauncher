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

EnmHanker.prototype._move = Enemy.prototype.move;
EnmHanker.prototype.move = function(target) {
	this.aim(target);
	this.radian = this.dir;
	this._move(target);
};
