/**
 * EnmWaver.
 */
function EnmWaver() {
	Enemy.apply(this, arguments);
	this.img = new Image();
	this.img.src = 'img/enmWaver.png';
	this.direction = 1;
}

EnmWaver.prototype = Object.create(Enemy.prototype);

EnmWaver.prototype.RANGE = 8;

EnmWaver.prototype.movePlus = function() {
	if (this.x < 0 || 500 < this.x) {
		this.dx = -this.dx;
	}
	if (this.RANGE < Math.abs(this.dy)) {
		this.direction = -this.direction;
	}
	this.dy += this.direction;
};
