/**
 * Gizmo.
 */
function Gizmo(type, destination) {
	this.type = type;
	this.destination = destination;
}
Gizmo.TYPE = {
	OWN: 0,
	AIM: 1,
	CHASE: 2
};
Gizmo.DEST = {
	TO: 0,
	TO_X: 1,
	TO_Y: 2,
	ROTATE: 3,
	ROTATE_L: 4,
	ROTATE_R: 5
};

Gizmo.prototype.tick = function(src, target) {
	if (this.type == Gizmo.TYPE.OWN) {
		if (this.destination == Gizmo.DEST.ROTATE_L) {
			src.dir -= src.step;
		} else if (this.destination == Gizmo.DEST.ROTATE_L) {
			src.dir += src.step;
		}
		return true;
	}
	var dx = target.x - src.x;
	var dy = target.y - src.y;

	if (Math.abs(dx) <= src.speed) {
		dx = 0;
	}
	if (Math.abs(dy) <= src.speed) {
		dy = 0;
	}
	if (this.type == Gizmo.TYPE.AIM) {
		if (this.destination == Gizmo.DEST.ROTATE) {
			var dist = src.calcDistance(target);

			if (src.speed < dist) {
				src.radian = Math.atan2(dy, dx);
			}
		}
		return true;
	}
	if (this.type == Gizmo.TYPE.CHASE) {
		if (this.destination == Gizmo.DEST.TO) {
			src.dir = Math.atan2(dy, dx);
			src.radian = src.dir;
		} else if (this.destination == Gizmo.DEST.TO_X && dx) {
			src.dir = Math.atan2(0, dx);
			src.radian = src.dir;
		} else if (this.destination == Gizmo.DEST.TO_Y && dy) {
			src.dir = Math.atan2(dy, 0);
			src.radian = src.dir;
		} else {
			return false;
		}
		return true;
	}
	return true;
};

/**
 * Movement.
 */
function Movement(cond) {
	var count = parseInt(cond);

	this.cond = cond;
	this.count = count == cond ? count : null;
	this.list = [];
}

Movement.prototype.add = function(type, target) {
	this.list.push(new Gizmo(type, target));
	return this;
};

Movement.prototype.tick = function(src, target) {
	var behave = false;

	this.list.forEach(function(giz) {
		if (giz.tick(src, target)) {
			behave = true;
		}
	});
	if (this.count) {
		if (src.routineCnt++ < this.count) {
			behave = true;
		} else {
			src.routineCnt = 0;
			behave = false;
		}
	}
	if (!behave) {
		src.routineIx++;
		if (src.routine.length <= src.routineIx) {
			src.routineIx = 0;
		}
	}
};
