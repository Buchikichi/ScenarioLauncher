function Rewinder(field, x, y) {
	Chain.apply(this, arguments);

	this.step = Math.SQ / 100;
	this.radius = Rewinder.RADIUS;
	this.speed = 2.2;
	this.hitPoint = 300;
	this.margin = Field.HALF_WIDTH;
	this.ratio = Rewinder.RATIO_MAX;
	this.delta = -.8;
	this.anim = new Animator(this, 'material/cascade.png', Animator.TYPE.NONE);
	this.routine = [
		new Movement().add(Gizmo.TYPE.AIM, Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED, Gizmo.DEST.TO)
	];
	this.appears = false;
	for (var cnt = 0; cnt < Rewinder.MAX_JOINT; cnt++) {
		this.push(new RewinderChild(field, x, y));
	}
}
Rewinder.prototype = Object.create(Chain.prototype);
Rewinder.RADIUS = 4;
Rewinder.RADIAN_STEP = Math.SQ;
Rewinder.RATIO_MAX = 100;
Rewinder.MAX_JOINT = 16;

Rewinder.prototype._move = Enemy.prototype.move;
Rewinder.prototype.move = function(target) {
	var result = [];
	var rad = Math.trim(this.radian - Math.SQ / 2);

	this._move(target);
	if (this.appears) {
		var joint = this.next;

		while (joint) {
			rad += Rewinder.RADIAN_STEP * this.ratio / 100;
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
};

Rewinder.prototype.fate = NOP;

/**
 * RewinderChild.
 */
function RewinderChild(field, x, y) {
	Chain.apply(this, arguments);

	this.margin = Field.HALF_WIDTH;
	this.effectH = false;
	this.effectV = false;
	this.radius = RewinderChild.RADIUS;
	this.anim = new Animator(this, 'boss/winding.joint.png', Animator.TYPE.NONE);
}
RewinderChild.RADIUS = 4;
RewinderChild.prototype = Object.create(Chain.prototype);

RewinderChild.prototype.move = function(target) {
	var prev = this.prev;
	var dist = this.radius + prev.radius;

	this.x = prev.x + Math.cos(this.radian) * dist;
	this.y = prev.y + Math.sin(this.radian) * dist;
};

RewinderChild.prototype.fate = NOP;
