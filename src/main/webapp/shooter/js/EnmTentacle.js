function EnmTentacle(field, x, y) {
	Chain.apply(this, arguments);

	this.speed = .8;
	this.hitPoint = 16;
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

EnmTentacle.prototype.movePlus = function(target) {
	var dx = target.x - this.x;
	var dy = target.y - this.y;

	this.dir = Math.atan2(dy, dx);
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
