function EnmTentacleHead(speed) {
	EnmTentacleJoint.apply(this, arguments);

	this.img.src = 'img/enmTentacleHead.png';
}
EnmTentacleHead.prototype = Object.create(EnmTentacleJoint.prototype);

EnmTentacleHead.prototype.trigger = Enemy.prototype.trigger;
