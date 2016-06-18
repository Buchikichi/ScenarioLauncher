function EnmTentacleJoint(speed) {
	Chain.apply(this, arguments);

	this.radius = 4;
	this.radian = 0;
	this.speed = speed;
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

EnmTentacleJoint.prototype.move = function(target) {
	var prev = this.prev;
	var step = this.closeGap(target) * .7;
	if (prev instanceof EnmTentacleJoint) {
		step *= .3;
	}
	var radian = this.addRadian(step);
	var dist = this.radius + prev.radius;

	this.x = prev.x + Math.cos(radian) * dist;
	this.y = prev.y + Math.sin(radian) * dist;
};

EnmTentacleJoint.prototype.fate = function() {
	// nop
};

EnmTentacleJoint.prototype.trigger = function() {
	// nop
};
