/**
 * Tentacle.
 */
class Tentacle extends Chain {
	constructor(x, y) {
		super(x, y);
		this.speed = .1;
		this.hitPoint = 16;
		this.appears = false;
		this.anim = new Animator(this, 'enemy/tentacle.png');
		this.routine = [
			new Movement().add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO).add(Gizmo.TYPE.AIM, Gizmo.DEST.ROTATE, Tentacle.DEG_STEP)
		];
		// Joint
		this.push(new TentacleHead(0));
		for (let cnt = 0; cnt < Tentacle.MAX_JOINT; cnt++) {
			let speed = Tentacle.MAX_JOINT - cnt;

			this.push(new TentacleJoint(speed * speed));
		}
		this.score = 150;
	}

	eject() {
		let joint = this.next;

		while (joint) {
			joint.eject();
			joint = joint.next;
		}
		this.isGone = true;
		this.x = -this.width;
	}

	calcRadian() {
		return this.radian;
	}

	calcRelative() {
		return this.radian;
	}

	move(target) {
		this.radius = this.hitPoint / 2 + 8;
		this.scale = this.radius / Tentacle.MAX_RADIUS;
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

	trigger() {};
}
Tentacle.MAX_JOINT = 8;
Tentacle.MAX_RADIUS = 16;
Tentacle.DEG_STEP = Math.PI / (180 * 4);

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

	calcRadian() {
		return Math.trim(this.prev.calcRadian() + this.radian);
	}

	calcRelative() {
		return Math.trim(this.radian - this.prev.calcRadian());
	}

	addRadian(rad) {
		this.radian = Math.trim(this.radian + rad);
//		if (this.next) {
//			this.next.addRadian(rad);
//		}
		return this.radian;
	}

	rotate(target) {
		let prev = this.prev;
		let radian = this.calcRadian();
		let dx = target.x - this.x;
		let dy = target.y - this.y;
		let rad = Math.close(radian, Math.atan2(dy, dx), TentacleJoint.DEG_STEP * this.speed);

		this.radian = rad;
		this.radian = this.calcRelative();
		if (this.radian < -TentacleJoint.MAX_RAD) {
			this.radian = -TentacleJoint.MAX_RAD;
		}
		if (TentacleJoint.MAX_RAD < this.radian) {
			this.radian = TentacleJoint.MAX_RAD;
		}
	}

	move(target) {
		let prev = this.prev;
		let radian = prev.calcRadian();
		let distance = prev.radius + this.radius;

		this.x = prev.x + Math.cos(radian) * distance;
		this.y = prev.y + Math.sin(radian) * distance;
		this.rotate(target);
	}

	fate() {}
	trigger() {};
}
TentacleJoint.DEG_STEP = Math.PI / (180 * 45);
TentacleJoint.MAX_RAD = Math.PI / 6;

/**
 * TentacleHead.
 */
class TentacleHead extends TentacleJoint {
	constructor(speed) {
		super(speed);
		this.anim = new Animator(this, 'enemy/tentacleHead.png');
	}

	rotate(target) {
		let dx = target.x - this.x;
		let dy = target.y - this.y;
		let rad = Math.close(this.radian, Math.atan2(dy, dx), TentacleHead.DEG_STEP);

		this.radian = rad;
	}
}
TentacleHead.DEG_STEP = Math.PI / 100;
ImageManager.Instance.reserve(['enemy/tentacle.png', 'enemy/tentacleHead.png']);
