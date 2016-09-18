/**
 * Titan.
 */
function Titan() {
	Enemy.apply(this, arguments);
	var asf = MotionManager.INSTANCE.dic['asf'];

	this.hitPoint = Number.MAX_SAFE_INTEGER;
	//
	this.motionRoutine = new MotionRoutine([
		new Motion(Motion.TYPE.ONLY_ONE, '111_7.amc', 4, Math.PI / 4, 0),
		new Motion(Motion.TYPE.NORMAL, '79_96.amc', 4, -Math.PI * .4, 0),
	]);
	this.routineNum = 0;
	this.routineLoop = 0; // 何回目のループか
	if (asf) {
		this.skeleton = new Skeleton(asf);
	}
}
Titan.prototype = Object.create(Enemy.prototype);

Titan.prototype._move = Enemy.prototype.move;
Titan.prototype.move = function(target) {
	this._move(target);
	var skeleton = this.skeleton;

	this.motionRoutine.next(skeleton);
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
