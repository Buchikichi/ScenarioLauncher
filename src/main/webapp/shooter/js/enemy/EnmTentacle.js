/**
 * EnmTentacle.
 */
function EnmTentacle(field, x, y) {
	Chain.apply(this, arguments);

	this.speed = 1.2;
	this.hitPoint = 16;
	this.appears = false;
	this.anim = new Animator(this, 'enemy/tentacle.png', Animator.TYPE.NONE);
	this.routine = [
		new Movement().add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO)
	];
	// Joint
	this.push(new EnmTentacleHead(5 + EnmTentacle.MAX_JOINT));
	for (var cnt = 0; cnt < EnmTentacle.MAX_JOINT; cnt++) {
		var speed = 5 + EnmTentacle.MAX_JOINT - cnt;
		this.push(new EnmTentacleJoint(speed));
	}
	this.score = 150;
}
EnmTentacle.prototype = Object.create(Chain.prototype);
EnmTentacle.MAX_JOINT = 8;
EnmTentacle.MAX_RADIUS = 16;
EnmTentacle.DEG_STEP = Math.PI / 2000;


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
	this.radius = this.hitPoint / 2 + 8;
	this.scale = this.radius / EnmTentacle.MAX_RADIUS;
	this._move(target);
	this.radian = this.next.radian;
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

EnmTentacle.prototype.trigger = NOP;

/**
 * EnmTentacleJoint.
 */
function EnmTentacleJoint(speed) {
	Chain.apply(this, arguments);

	this.radius = 4;
	this.radian = 0;
	this.speed = speed;
	this.anim = new Animator(this, 'enemy/tentacleJoint.png', Animator.TYPE.NONE);
}
EnmTentacleJoint.prototype = Object.create(Chain.prototype);

EnmTentacleJoint.prototype.addRadian = function(rad) {
	this.radian = Math.trim(this.radian + rad);
	if (this.next) {
//		this.next.addRadian(rad);
	}
	return this.radian;
};

EnmTentacleJoint.prototype.move = function(target) {
	var dx = target.x - this.x;
	var dy = target.y - this.y;
	var rad = Math.close(this.radian, Math.atan2(dy, dx), EnmTentacle.DEG_STEP * this.speed);
	var diff = Math.trim(rad - this.radian);
	var prev = this.prev;
	var radian = this.addRadian(diff);
	var dist = this.radius + prev.radius;

	this.x = prev.x + Math.cos(radian) * dist;
	this.y = prev.y + Math.sin(radian) * dist;
};

EnmTentacleJoint.prototype.fate = NOP;
EnmTentacleJoint.prototype.trigger = NOP;

/**
 * EnmTentacleHead.
 */
function EnmTentacleHead(speed) {
	EnmTentacleJoint.apply(this, arguments);

	this.anim = new Animator(this, 'enemy/tentacleHead.png', Animator.TYPE.NONE);
}
EnmTentacleHead.prototype = Object.create(EnmTentacleJoint.prototype);

EnmTentacleHead.prototype.trigger = Enemy.prototype.trigger;
