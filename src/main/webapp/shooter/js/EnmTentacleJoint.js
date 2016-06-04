function EnmTentacleJoint(speed) {
	Chain.apply(this, arguments);

	this.dx = 0;
	this.dy = 0;
	this.radius = 4;
	this.radian = 0;
	this.speed = speed;
	this.hasBullet = false;
	this.img.src = 'img/enmTentacleJoint.png';
}
EnmTentacleJoint.prototype = Object.create(Chain.prototype);

EnmTentacleJoint.prototype.addRadian = function(rad) {
	this.radian = this.trimRadian(this.radian + rad);
	if (this.next) {
		this.next.addRadian(rad);
	}
	return this.radian;
};

EnmTentacleJoint.prototype.closeGap = function(targetRad) {
	var step = this.speed * Math.PI / 300;
	var diff = this.radian - targetRad;

	if (Math.PI < Math.abs(diff)) {
		step *= -1;
	}
	if (0 < diff) {
		step *= -1;
	}
	return step;
}

EnmTentacleJoint.prototype.trimRadian = function(radian) {
	var rad = radian;

	if (Math.PI < rad) {
		rad -= Math.PI * 2;
	}
	if (rad < -Math.PI) {
		rad += Math.PI * 2;
	}
	return rad;
};

EnmTentacleJoint.prototype.movePlus = function(target) {
	var prev = this.prev;
	var dx = target.x - this.x;
	var dy = target.y - this.y;
	var rad = Math.atan2(dy, dx);
	var step = this.closeGap(rad);
	var radian = this.addRadian(step);
	var prev = this.prev;
	var dist = this.radius + prev.radius;

	this.x = prev.x + Math.cos(radian) * dist;
	this.y = prev.y + Math.sin(radian) * dist;
};

EnmTentacleJoint.prototype.fate = function() {
	// nop
};
