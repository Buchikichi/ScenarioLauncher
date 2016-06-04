/**
 * EnmWaver.
 */
function EnmWaver() {
	Enemy.apply(this, arguments);
	this.img.src = 'img/enmWaver.png';
	this.dx = -4;
	this.direction = 1;
}

EnmWaver.prototype = Object.create(Enemy.prototype);

EnmWaver.prototype.RANGE = 8;

EnmWaver.prototype.movePlus = function() {
	if (this.x + this.width < 0) {
		this.isGone = true;
	}
	if (this.RANGE < Math.abs(this.dy)) {
		this.direction = -this.direction;
	}
	this.dy += this.direction;
};
