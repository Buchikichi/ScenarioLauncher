class Cascade extends Chain {
	constructor(x, y) {
		super(x, y);
		this.anim = new Animator(this, 'material/cascade.png');
		this.radian = Math.SQ;
		this.radius = Cascade.RADIUS;
		this.appears = false;
		for (let cnt = 0; cnt < Cascade.MAX_JOINT; cnt++) {
			let weight = (Cascade.MAX_JOINT - cnt) * 3;

			this.push(new CascadeChild(x, y, weight));
		}
	}

	move(target) {
		super.move(target);
		if (this.appears) {
			return;
		}
		this.appears = true;
		let result = [];
		let joint = this.next;

		while (joint) {
			result.push(joint);
			joint = joint.next;
		}
		return result;
	}

	fate() {}
}
Cascade.RADIUS = 4;
Cascade.MAX_JOINT = 12;

/**
 * CascadeChild.
 */
class CascadeChild extends Chain {
	constructor(x, y, weight) {
		super(x, y);
		this.effectH = false;
		this.effectV = false;
		this.weight = weight;
		this.radian = Math.SQ * .9;
		this.radius = Cascade.RADIUS;
		this.step = 0;
		if (Field.Instance) {
			this.maxX = Field.Instance.width + 100;
		}
	}

	addRadian(rad) {
		this.radian = Math.trim(this.radian + rad);
//		if (this.next) {
//			this.next.addRadian(rad / 8);
//		}
		return this.radian;
	}

	move(target) {
		let prev = this.prev;
		let diff = Math.trim(Math.SQ - this.radian) / (300 + this.weight * 10);
		this.step += diff;
		if (parseInt(diff * 1000) == 0) {
			this.step *= .98;
		}
		let radian = Math.trim(this.radian + this.step);
		let dist = this.radius + prev.radius;

		if (radian < 0) {
			radian = 0;
		}
		this.radian = radian;
		this.x = prev.x + Math.cos(radian) * dist;
		this.y = prev.y + Math.sin(radian) * dist;
	}

	draw(ctx) {
		ctx.save();
		ctx.fillStyle = 'rgba(60, 200, 0, 0.8)';
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, Math.PI2, false);
		ctx.fill();
		ctx.restore();
	}

	fate(target) {
		let radian = Math.PI / 200;

		this.step -= radian;
		let joint = this.next;

		while (joint) {
			joint.step -= radian * .8;
			joint = joint.next;
		}
	}
}
