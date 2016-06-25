/**
 * Ship.
 */
function Ship(field, x, y) {
	Actor.apply(this, arguments);
	this.speed = 4;
	this.shotList = [];
	this.trigger = false;
	this.img.src = 'img/ship001.png';
}
Ship.MAX_SHOTS = 7;
Ship.SQ = Math.PI / 2;
Ship.prototype = Object.create(Actor.prototype);

Ship.prototype._recalculation = Actor.prototype.recalculation;
Ship.prototype.recalculation = function() {
	this.right = this.field.width - this.width * 3;
	this.bottom = this.field.height - this.hH;
	this._recalculation();
};

Ship.prototype.inkey = function(keys) {
	var hit = false;
	var dir = 0;

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

Ship.prototype._move = Actor.prototype.move;
Ship.prototype.move = function() {
	this._move();
	if (this.isGone) {
		return;
	}
	if (this.x < this.hW || this.right < this.x) {
		this.x = this.svX;
	}
	if (this.y < this.hH || this.bottom < this.y) {
		this.y = this.svY;
	}
	if (this.trigger && this.shotList.length < Ship.MAX_SHOTS) {
		this.trigger = false;
		return new Shot(this.field, this.x + this.hW, this.y);
	}
};
