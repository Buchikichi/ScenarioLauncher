/**
 * Titan.
 */
function Titan() {
	Enemy.apply(this, arguments);
	var asf = MotionManager.INSTANCE.dic['asf'];
	var mot = MotionManager.INSTANCE.dic['111_7.amc'];

	if (asf && mot) {
		this.mot = mot;
		this.num = 0;
		this.motdir = 1;
		this.skeleton = new Skeleton(asf);
	}
	this.hitPoint = Number.MAX_SAFE_INTEGER;

}
Titan.prototype = Object.create(Enemy.prototype);

Titan.prototype._move = Enemy.prototype.move;
Titan.prototype.move = function(target) {
	this._move(target);
	var motion = this.mot[this.num];

	this.skeleton.shift(motion);
	this.num += this.motdir * 4;
	if (this.mot.length <= this.num) {
		this.num = this.mot.length - 1;
		this.motdir *= -1;
	} else if (this.num < 0) {
		this.num = 0;
		this.motdir *= -1;
	}
};

Titan.prototype.drawNormal = function(ctx) {
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.beginPath();
	ctx.strokeStyle = 'red';
	ctx.arc(0, 0, 8, 0, Math.PI * 2, false);
	ctx.stroke();
	if (this.skeleton) {
		ctx.scale(7, 7);
		this.skeleton.draw(ctx);
	}
	ctx.restore();
};
