function Cascade(field, x, y) {
	Chain.apply(this, arguments);

	this.radius = Cascade.RADIUS;
	this.appears = false;
	for (var cnt = 0; cnt < Cascade.MAX_JOINT; cnt++) {
		var weight = (Cascade.MAX_JOINT - cnt) * 6;

		this.push(new CascadeChild(field, x, y, weight));
	}
}
Cascade.prototype = Object.create(Chain.prototype);
Cascade.RADIUS = 4;
Cascade.MAX_JOINT = 12;

Cascade.prototype._move = Enemy.prototype.move;
Cascade.prototype.move = function(target) {
	this._move(target);
	if (this.appears) {
		return;
	}
	this.appears = true;
	var result = [];
	var joint = this.next;

	while (joint) {
		result.push(joint);
		joint = joint.next;
	}
	return result;
};

Cascade.prototype.draw = function(ctx) {
	ctx.save();
	ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
	ctx.translate(this.x, this.y);
	ctx.beginPath();
	ctx.arc(0, 0, this.radius, 0, Math.PI2, false);
	ctx.fill();
	ctx.restore();
};

Cascade.prototype.fate = NOP;
Cascade.prototype.trigger = NOP;

/**
 * CascadeChild.
 */
function CascadeChild(field, x, y, weight) {
	Chain.apply(this, arguments);

	this.weight = weight;
	this.radius = Cascade.RADIUS;
	this.step = 0;
}
CascadeChild.prototype = Object.create(Chain.prototype);

CascadeChild.prototype.addRadian = function(rad) {
	this.radian = Math.trim(this.radian + rad);
	if (this.next) {
//		this.next.addRadian(rad / 8);
	}
	return this.radian;
};

CascadeChild.prototype.move = function(target) {
	var prev = this.prev;
	var diff = Math.trim(Math.SQ - this.radian) / (200 + this.weight);
	this.step += diff;
	if (parseInt(diff * 1000) == 0) {
		this.step *= .98;
	}
	var radian = this.addRadian(this.step);
	var dist = this.radius + prev.radius;

	this.x = prev.x + Math.cos(radian) * dist;
	this.y = prev.y + Math.sin(radian) * dist;
};

CascadeChild.prototype.draw = function(ctx) {
	ctx.save();
	ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
	ctx.translate(this.x, this.y);
	ctx.beginPath();
	ctx.arc(0, 0, this.radius, 0, Math.PI2, false);
	ctx.fill();
	ctx.restore();
};

CascadeChild.prototype.fate = NOP;
CascadeChild.prototype.trigger = NOP;
