/**
 * Battery.
 */
class Battery extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.speed = 0;
		this.hitPoint = 1;
		this.score = 10;
		this.anim = [
			new Animator(this, 'enemy/battery.png'),
			new Animator(this, 'enemy/batteryBase.png', Animator.TYPE.NONE)
		];
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
	}
}
