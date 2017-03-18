/**
 * Tentacle.
 */
class Tentacle extends Chain {
	constructor(x, y) {
		super(x, y);
		this.speed = .6;
		this.hitPoint = 16;
		this.appears = false;
		this.anim = new Animator(this, 'enemy/tentacle.png');
		this.routine = [
			new Movement().add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO)
		];
		// Joint
		this.push(new TentacleHead(5 + Tentacle.MAX_JOINT));
		for (var cnt = 0; cnt < Tentacle.MAX_JOINT; cnt++) {
			var speed = 5 + Tentacle.MAX_JOINT - cnt;
			this.push(new TentacleJoint(speed));
		}
		this.score = 150;
	}

	eject() {
		var joint = this.next;

		while (joint) {
			joint.eject();
			joint = joint.next;
		}
		this.isGone = true;
		this.x = -this.width;
	}

	move(target) {
		this.radius = this.hitPoint / 2 + 8;
		this.scale = this.radius / Tentacle.MAX_RADIUS;
		super.move(target);
		this.radian = this.next.radian;
		if (this.appears) {
			return;
		}
		this.appears = true;
		var result = [];
		var joint = this.next;

		while (joint) {
			result.push(joint);
			joint = joint.next;
		}
		return result;
	}

	trigger() {};
}
Tentacle.MAX_JOINT = 8;
Tentacle.MAX_RADIUS = 16;
Tentacle.DEG_STEP = Math.PI / 2000;

/**
 * TentacleJoint.
 */
class TentacleJoint extends Chain {
	constructor(speed) {
		super(0, 0);
		this.hasBounds = false;
		this.radius = 4;
		this.radian = 0;
		this.speed = speed;
		this.anim = new Animator(this, 'enemy/tentacleJoint.png');
	}

	addRadian(rad) {
		this.radian = Math.trim(this.radian + rad);
//		if (this.next) {
//			this.next.addRadian(rad);
//		}
		return this.radian;
	}

	move(target) {
		var dx = target.x - this.x;
		var dy = target.y - this.y;
		var rad = Math.close(this.radian, Math.atan2(dy, dx), Tentacle.DEG_STEP * this.speed);
		var diff = Math.trim(rad - this.radian);
		var prev = this.prev;
		var radian = this.addRadian(diff);
		var dist = this.radius + prev.radius;

		this.x = prev.x + Math.cos(radian) * dist;
		this.y = prev.y + Math.sin(radian) * dist;
	}

	fate() {}
	trigger() {};
}

/**
 * TentacleHead.
 */
class TentacleHead extends TentacleJoint {
	constructor(speed) {
		super(0, 0);
		this.anim = new Animator(this, 'enemy/tentacleHead.png');
	}
}
