/**
 * Ship.
 */
function Ship(field, x, y) {
	Actor.apply(this, arguments);
	this.speed = 4;
	this.recalculation();
	this.img.src = 'img/ship001.png';
}
Ship.prototype = Object.create(Actor.prototype);

Ship.prototype.recalculation = function() {
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.maxX = this.field.width - this.width * 3;
	this.maxY = this.field.height - this.hH;
};

Ship.prototype.movePlus = function() {
	if (this.x < this.hW || this.maxX < this.x) {
		this.x = this.svX;
	}
	if (this.y < this.hH || this.maxY < this.y) {
		this.y = this.svY;
	}
};
