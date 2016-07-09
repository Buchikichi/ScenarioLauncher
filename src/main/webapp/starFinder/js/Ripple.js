function Ripple(field) {
	this.field = field;
	this.radius = 0;
	this.max = 0;
}

Ripple.prototype.begin = function(x, y) {
	this.x = x;
	this.y = y;
	this.radius = 0;
	this.max = this.field.width / 8;
};

Ripple.prototype.stop = function() {
	this.radius = Number.MAX_VALUE;
};

Ripple.prototype.draw = function(ctx) {
	if (this.max < this.radius) {
		return;
	}
	ctx.save();
	ctx.translate(this.field.hW, this.field.hH);
	ctx.beginPath();
	ctx.strokeStyle = 'rgba(255, 255, 0, .4)';
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI2, false);
	ctx.stroke();
	ctx.restore();

	this.radius += 10;
};
