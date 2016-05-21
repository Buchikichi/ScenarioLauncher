function EnmTentacleHead(speed) {
	EnmTentacleJoint.apply(this, arguments);

	this.hasBullet = true;
	this.img.src = 'img/enmTentacleHead.png';
}
EnmTentacleHead.prototype = Object.create(EnmTentacleJoint.prototype);
