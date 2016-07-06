/**
 * EnmTentacle.
 */
function EnmTentacle(field, x, y) {
	Chain.apply(this, arguments);

	this.speed = .8;
	this.hitPoint = 16;
	this.appears = false;
	this.img.src = 'img/enmTentacle.png';
	// Joint
	this.push(new EnmTentacleHead(.8));
	for (var cnt = 1; cnt < EnmTentacle.MAX_JOINT; cnt++) {
		this.push(new EnmTentacleJoint(.3));
	}
	this.push(new EnmTentacleJoint(1));
	this.score = 150;
}
EnmTentacle.prototype = Object.create(Chain.prototype);
EnmTentacle.MAX_JOINT = 8;
EnmTentacle.MAX_RADIUS = 16;

EnmTentacle.prototype.eject = function() {
	var joint = this.next;

	while (joint) {
		joint.eject();
		joint = joint.next;
	}
	this.isGone = true;
	this.x = -this.width;
};

EnmTentacle.prototype._move = Enemy.prototype.move;
EnmTentacle.prototype.move = function(target) {
	this.aim(target);
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

EnmTentacle.prototype.drawNormal = function(ctx) {
	this.radius = this.hitPoint / 2 + 8;
	var sc = this.radius / EnmTentacle.MAX_RADIUS;
	ctx.save();
	ctx.translate(this.x, this.y);
	if (this.next) {
		ctx.rotate(this.next.radian);
	}
	ctx.scale(sc, sc);
	ctx.drawImage(this.img, -this.radius, -this.radius);
	ctx.restore();

//	ctx.beginPath();
//	ctx.strokeStyle = 'rgba(0, 0, 255, 1)';
//	ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//	ctx.stroke();
};

EnmTentacle.prototype.trigger = function() {
	// nop
};

/**
 * EnmTentacleJoint.
 */
function EnmTentacleJoint(speed) {
	Chain.apply(this, arguments);

	this.radius = 4;
	this.radian = 0;
	this.speed = speed;
	this.img.src = 'img/enmTentacleJoint.png';
}
EnmTentacleJoint.prototype = Object.create(Chain.prototype);

EnmTentacleJoint.prototype.addRadian = function(rad) {
	this.radian = Math.trim(this.radian + rad);
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

/**
 * EnmTentacleHead.
 */
function EnmTentacleHead(speed) {
	EnmTentacleJoint.apply(this, arguments);

	this.img.src = 'img/enmTentacleHead.png';
}
EnmTentacleHead.prototype = Object.create(EnmTentacleJoint.prototype);

EnmTentacleHead.prototype.trigger = Enemy.prototype.trigger;
