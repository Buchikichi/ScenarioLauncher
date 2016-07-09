/**
 * EnmBattery.
 */
function EnmBattery() {
	Enemy.apply(this, arguments);
	this.speed = 0;
	this.hitPoint = 1;
	this.score = 10;
	this.img.src = 'img/enmBattery.png';
	this.base = new Image();
	this.base.src = 'img/enmBatteryBase.png';
	this.routine = [
		new Movement().add(Gizmo.TYPE.AIM, Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED, Gizmo.DEST.TO)
	];
	this.isInverse = false;
	if (this.field && this.field.landform) {
		var landform = this.field.landform;
		var src = {x:this.x, y:this.y + Landform.BRICK_WIDTH};

		landform.hitTest(src);
		this.isInverse = !src.isHitWall;
	}
}
EnmBattery.prototype = Object.create(Enemy.prototype);

EnmBattery.prototype._drawNormal = Enemy.prototype.drawNormal;
EnmBattery.prototype.drawNormal = function(ctx) {
	this._drawNormal(ctx);
	ctx.save();
	ctx.translate(this.x, this.y);
	if (this.isInverse) {
		ctx.rotate(Math.PI);
	}
	ctx.drawImage(this.base, -this.hW, -this.hH);
	ctx.restore();
};
