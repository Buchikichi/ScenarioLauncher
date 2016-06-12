function Esse(x, y) {
	this.x = x;
	this.y = y;
	this.id = this.x + ':' + this.y;
}

Esse.prototype.distanceFrom = function(target) {
	var dx = target.x - this.x;
	var dy = target.y - this.y;

	return Math.sqrt(dx * dx + dy * dy);
};
