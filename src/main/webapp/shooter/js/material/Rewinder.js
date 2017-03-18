class Rewinder extends Chain {
	constructor(x, y) {
		super(x, y);
		this.step = Math.SQ / 100;
		this.radius = Rewinder.RADIUS;
		this.speed = 1.1;
		this.hitPoint = Number.MAX_SAFE_INTEGER;
		this.hasBounds = false;
		this.ratio = Rewinder.RATIO_MAX;
		this.delta = -.8;
		this.anim = new Animator(this, 'material/cascade.png');
		this.routine = [
			new Movement().add(Gizmo.TYPE.AIM, Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED, Gizmo.DEST.TO)
		];
		this.appears = false;
		for (var cnt = 0; cnt < Rewinder.MAX_JOINT; cnt++) {
			this.push(new RewinderChild(x, y));
		}
	}

	move(target) {
		var result = [];
		var rad = Math.trim(this.radian + Math.SQ / 2);

		super.move(target);
		if (this.appears) {
			var joint = this.next;

			while (joint) {
				rad -= Rewinder.RADIAN_STEP * this.ratio / 100;
				joint.radian = Math.trim(rad);
				joint = joint.next;
			}
			this.ratio += this.delta;
			if (this.ratio <= 1) {
				this.delta *= -1;
			} else if (Rewinder.RATIO_MAX <= this.ratio) {
				this.delta *= -1;
			}
			return result;
		}
		this.appears = true;
		var joint = this.next;

		while (joint) {
			result.push(joint);
			joint = joint.next;
		}
		return result;
	}

	fate() {}
}
Rewinder.RADIUS = 4;
Rewinder.RADIAN_STEP = Math.SQ;
Rewinder.RATIO_MAX = 100;
Rewinder.MAX_JOINT = 16;

/**
 * RewinderChild.
 */
class RewinderChild extends Chain {
	constructor(x, y) {
		super(x, y);
		this.radian = 0;
		this.hasBounds = false;
		this.effectH = false;
		this.effectV = false;
		this.radius = RewinderChild.RADIUS;
		this.anim = new Animator(this, 'boss/winding.joint.png');
	}

	move(target) {
		var prev = this.prev;
		var dist = this.radius + prev.radius;

		this.x = prev.x + Math.cos(this.radian) * dist;
		this.y = prev.y + Math.sin(this.radian) * dist;
	}

	fate() {}
}
RewinderChild.RADIUS = 4;
