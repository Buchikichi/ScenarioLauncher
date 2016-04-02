function Picket(x, y) {
	Chain.apply(this, arguments);
	this.parent = null;
}
Picket.RADIUS = 2;
Picket.prototype = Object.create(Chain.prototype);

Picket.prototype.includes = function(pt) {
	var dx = pt.x - this.x;
	var dy = pt.y - this.y;
	var dist = Math.sqrt(dx * dx + dy * dy);

	return dist <= Picket.RADIUS * 2;
};

Picket.prototype.derive = function(radian, dist) {
	var rad = Math.round(radian * 4 / Math.PI) * Math.PI / 4;
	var sign = dist < 0 ? -1 : 1;
	var radius = Picket.RADIUS * sign;
	var sx = this.x + Math.cos(rad) * radius;
	var sy = this.y + Math.sin(rad) * radius;
	var picket = new Picket(sx, sy);

	picket.parent = this;
	return picket;
};

Picket.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, Picket.RADIUS, 0, Math.PI * 2, false);
	ctx.fill();
};
