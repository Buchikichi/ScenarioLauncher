/**
 * ななめ.
 */
function Diagonal(bp, ep) {
	var bx = bp.x;
	var by = bp.y;
	var ex = ep.x;
	var ey = ep.y;

	this.bx = bx;
	this.by = by;
	this.ex = ex;
	this.ey = ey;
	this.radian = Math.atan2(ey - by, ex - bx);
}

Diagonal.prototype.addMargin = function(margin) {
	var bx = this.bx;
	var by = this.by;
	var ex = this.ex;
	var ey = this.ey;

	if (ex < bx) {
		this.bx = ex;
		this.ex = bx;
	}
	if (ey < by) {
		this.by = ey;
		this.ey = by;
	}
	this.bx -= margin;
	this.by -= margin;
	this.ex += margin;
	this.ey += margin;
	return this;
};

Diagonal.prototype.rectIncludes = function(obj) {
	var x = obj.x;
	var y = obj.y;

	return this.bx <= x && x <= this.ex && this.by <= y && y <= this.ey;
};

Diagonal.prototype.distanceFrom = function(obj) {
	var dx = obj.x - this.bx;
	var dy = obj.y - this.by;
	var dist = Math.sqrt(dx * dx + dy * dy);
	var radian = this.radian - Math.atan2(dy, dx);

	return dist * Math.sin(radian);
};

Diagonal.prototype.drawRect = function(ctx) {
	ctx.strokeRect(this.bx, this.by, this.ex - this.bx, this.ey - this.by);
};
