/**
 * Ship.
 */
function Ship(field, x, y) {
	Actor.apply(this, arguments);
	this.speed = 4;
	this.recalculation();
	this.img.src = 'img/ship001.png';
}
Ship.SQ = Math.PI / 2;
Ship.prototype = Object.create(Actor.prototype);

Ship.prototype.recalculation = function() {
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.maxX = this.field.width - this.width * 3;
	this.maxY = this.field.height - this.hH;
};

Ship.prototype.inkey = function(keys) {
	var hit = false;
	var dir = 0;

	this.dir = null;
	if (keys['k37']) {
		dir = 1;
		hit = true;
	} else if (keys['k39']) {
		dir = -1;
		hit = true;
	}
	if (keys['k38']) {
		dir = 2 - dir * .5;
		hit = true;
	} else if (keys['k40']) {
		dir *= .5;
		hit = true;
	}
	if (hit) {
		this.dir = (dir + 1) * Ship.SQ;
	}
};

Ship.prototype.movePlus = function() {
	if (this.x < this.hW || this.maxX < this.x) {
		this.x = this.svX;
	}
	if (this.y < this.hH || this.maxY < this.y) {
		this.y = this.svY;
	}
};
