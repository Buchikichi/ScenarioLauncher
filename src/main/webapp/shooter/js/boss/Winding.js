function Winding(field, x, y) {
	Chain.apply(this, arguments);

	this.dir = -Math.PI;
	this.step = Math.SQ / 100;
	this.radius = Winding.RADIUS;
	this.speed = 2.2;
	this.hitPoint = 300;
	this.margin = Field.HALF_WIDTH;
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
Winding.prototype = Object.create(Chain.prototype);
Winding.RADIUS = 16;
Winding.RADIAN_STEP = Math.SQ;
Winding.RATIO_MAX = 50;
Winding.MAX_JOINT = 20;

Winding.prototype._move = Enemy.prototype.move;
Winding.prototype.move = function(target) {
	var result = this._move(target);
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
};

Winding.prototype._fate = Actor.prototype.fate;
Winding.prototype.fate = function(target) {
	this._fate(target);
	this.uncoil = true;
};

//Winding.prototype.trigger = NOP;

/**
 * WindingChild.
 */
function WindingChild(field, x, y) {
	Chain.apply(this, arguments);

	this.margin = Field.HALF_WIDTH;
	this.effectH = false;
	this.radius = WindingChild.RADIUS;
	this.anim = new Animator(this, 'boss/winding.joint.png', Animator.TYPE.NONE);
}
WindingChild.RADIUS = 4;
WindingChild.prototype = Object.create(Chain.prototype);

WindingChild.prototype.move = function(target) {
	var prev = this.prev;
	var dist = this.radius + prev.radius;

	this.x = prev.x + Math.cos(this.radian) * dist;
	this.y = prev.y + Math.sin(this.radian) * dist;
};

WindingChild.prototype.fate = NOP;
WindingChild.prototype.trigger = NOP;
