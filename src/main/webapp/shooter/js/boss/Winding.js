class Winding extends Chain {
	constructor(field, x, y) {
		super(field, x, y);
		this.dir = -Math.PI;
		this.step = Math.SQ / 100;
		this.radius = Winding.RADIUS;
		this.speed = .9;
		this.hitPoint = 150;
		this.hasBounds = false;
		this.ratio = Winding.RATIO_MAX;
		this.delta = -1;
		this.uncoil = false;
		this.anim = new Animator(this, 'boss/winding.png', Animator.TYPE.NONE);
		this.routine = [
			new Movement(200).add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE),
			new Movement(20).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
		];
		this.appears = false;
		for (var cnt = 0; cnt < Winding.MAX_JOINT; cnt++) {
			this.push(new WindingChild(field, x, y));
		}
	}

	move(target) {
		var result = super.move(target);
		var rad = Math.trim(this.dir - Math.SQ / 2);

		this.rad = Math.trim(this.dir + Math.SQ);
		if (this.appears) {
			var joint = this.next;

			while (joint) {
				rad += Winding.RADIAN_STEP * this.ratio / 100;
				joint.radian = Math.trim(rad);
				joint = joint.next;
			}
			if (this.uncoil) {
				this.ratio += this.delta;
				if (this.ratio <= 1) {
					this.delta *= -1;
				} else if (Winding.RATIO_MAX <= this.ratio) {
					this.uncoil = false;
					this.delta *= -1;
				}
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

	fate(target) {
		super.fate(target);
		this.uncoil = true;
	}

	//Winding.prototype.trigger = NOP;
}
Winding.RADIUS = 16;
Winding.RADIAN_STEP = Math.SQ;
Winding.RATIO_MAX = 50;
Winding.MAX_JOINT = 20;

/**
 * WindingChild.
 */
class WindingChild extends Chain {
	constructor(field, x, y) {
		super(field, x, y);
		this.hasBounds = false;
		this.effectH = false;
		this.radius = WindingChild.RADIUS;
		this.anim = new Animator(this, 'boss/winding.joint.png', Animator.TYPE.NONE);
	}

	move(target) {
		var prev = this.prev;
		var dist = this.radius + prev.radius;

		this.x = prev.x + Math.cos(this.radian) * dist;
		this.y = prev.y + Math.sin(this.radian) * dist;
	};

	fate() {}
	trigger() {}
}
WindingChild.RADIUS = 4;
