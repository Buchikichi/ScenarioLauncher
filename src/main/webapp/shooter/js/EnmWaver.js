/**
 * EnmWaver.
 */
function EnmWaver() {
	Enemy.apply(this, arguments);
	this.dir = this.x <= 0 ? 0 : Math.PI;
	this.step = Math.PI / 30;
	this.speed = 5;
	this.cnt = 0;
	this.direction = 1;
	this.score = 10;
	this.img.src = 'img/enmWaver.png';
}

EnmWaver.prototype = Object.create(Enemy.prototype);

EnmWaver.RANGE = 8;

EnmWaver.prototype._move = Enemy.prototype.move;
EnmWaver.prototype.move = function(target) {
	if (EnmWaver.RANGE < Math.abs(this.cnt)) {
		this.direction = -this.direction;
	}
	this.dir += this.direction * this.step;
	this.cnt += this.direction;
	this._move();
};
