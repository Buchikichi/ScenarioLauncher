/**
 * EnmWaver.
 */
function EnmWaver() {
	Enemy.apply(this, arguments);
	this.img.src = 'img/enmWaver.png';
	this.dir = Math.PI;
	this.step = Math.PI / 30;
	this.speed = 5;
	this.cnt = 0;
	this.direction = 1;
}

EnmWaver.prototype = Object.create(Enemy.prototype);

EnmWaver.RANGE = 8;

EnmWaver.prototype.movePlus = function() {
	if (this.x + this.width < 0) {
		this.isGone = true;
	}
	if (EnmWaver.RANGE < Math.abs(this.cnt)) {
		this.direction = -this.direction;
	}
	this.dir += this.direction * this.step;
	this.cnt += this.direction;
};
