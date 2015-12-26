/**
 * Ship.
 */
function Ship(field, x, y) {
	Actor.apply(this, arguments);
	this.speed = 4;
	this.width = 32;
	this.height = 16;
	this.maxX = this.field.width - this.width * 4;
	this.maxY = this.field.height - this.height;
	this.img.src = 'img/ship001.png';
}
Ship.prototype = Object.create(Actor.prototype);

Ship.prototype.movePlus = function() {
	if (this.x < 0 || this.maxX < this.x) {
		this.x = this.svX;
	}
	if (this.y < 0 || this.maxY < this.y) {
		this.y = this.svY;
	}
};
