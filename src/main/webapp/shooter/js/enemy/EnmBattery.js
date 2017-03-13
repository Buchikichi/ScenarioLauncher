/**
 * EnmBattery.
 */
class EnmBattery extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.speed = 0;
		this.hitPoint = 1;
		this.score = 10;
		this.anim = new Animator(this, 'enemy/battery.png', Animator.TYPE.NONE);
		this.base = new Image();
		this.base.src = 'img/enemy/batteryBase.png';
		this.routine = [
			new Movement().add(Gizmo.TYPE.AIM, Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED, Gizmo.DEST.TO)
		];
		this.isInverse = false;
		let field = Field.Instance;
		if (field && field.landform) {
			let landform = field.landform;
			let src = {x:this.x, y:this.y + Landform.BRICK_WIDTH};

			landform.hitTest(src);
			this.isInverse = !src.walled;
		}
	}

	drawNormal(ctx) {
		if (this.isInverse) {
			if (this.radian < -Math.SQ) {
				this.radian = Math.PI;
			} else if (this.radian < 0) {
				this.radian = 0
			}
		} else {
			if (Math.SQ < this.radian) {
				this.radian = Math.PI;
			} else if (0 < this.radian) {
				this.radian = 0
			}
		}
		super.drawNormal(ctx);
		ctx.save();
		ctx.translate(this.x, this.y);
		if (this.isInverse) {
			ctx.rotate(Math.PI);
		}
		ctx.drawImage(this.base, -this.hW, -this.hH);
		ctx.restore();
	}
}
