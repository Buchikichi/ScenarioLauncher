/**
 * Gizmo.
 */
function Gizmo(type, destination) {
	this.type = type;
	this.destination = destination;
}
Gizmo.TYPE = {
	FIXED: 0,
	OWN: 1,
	AIM: 2,
	CHASE: 3
};
Gizmo.DEST = {
	TO: 0,
	TO_X: 1,
	TO_Y: 2,
	ROTATE: 3,
	ROTATE_L: 4,
	ROTATE_R: 5,
	LEFT: 6,
	RIGHT: 7
};

Gizmo.prototype.tick = function(src, target) {
	var landform = src.field.landform;

	if (this.type == Gizmo.TYPE.FIXED) {
		src.dir = null;
		return;
	}
	if (this.type == Gizmo.TYPE.OWN) {
		if (this.destination == Gizmo.DEST.ROTATE_L) {
			src.dir -= src.step;
		} else if (this.destination == Gizmo.DEST.ROTATE_R) {
			src.dir += src.step;
		} else if (this.destination == Gizmo.DEST.LEFT) {
			src.dir = Math.PI;
		} else if (this.destination == Gizmo.DEST.RIGHT) {
			src.dir = 0;
		}
		return;
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
		if (this.destination == Gizmo.DEST.TO_X) {
			if (dx < 0) {
				src.radian = Math.PI;
			} else {
				src.radian = 0;
			}
		} else if (this.destination == Gizmo.DEST.TO_Y) {
			if (dx < 0) {
				src.radian = -Math.SQ;
			} else {
				src.radian = Math.SQ;
			}
		} else if (this.destination == Gizmo.DEST.ROTATE) {
			var dist = src.calcDistance(target);

			if (src.speed < dist) {
				var step = Math.PI / 30;

				src.radian = Math.close(src.radian, Math.atan2(dy, dx), step);
				src.radian = Math.trim(src.radian);
			}
		}
		return;
	}
	if (this.type == Gizmo.TYPE.CHASE) {
		if (this.destination == Gizmo.DEST.TO) {
			src.dir = Math.atan2(dy, dx);
		} else if (this.destination == Gizmo.DEST.TO_X && dx) {
			src.dir = Math.atan2(0, dx);
		} else if (this.destination == Gizmo.DEST.TO_Y && dy) {
			src.dir = Math.atan2(dy, 0);
		} else if (this.destination == Gizmo.DEST.ROTATE) {
			var step = Math.PI / 60;

			src.dir = Math.close(src.dir, Math.atan2(dy, dx), step);
			src.radian = src.dir;
		}
	}
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
Movement.COND = {
	X: 'x',
	Y: 'y'
};

Movement.prototype.add = function(type, target) {
	this.list.push(new Gizmo(type, target));
	return this;
};

Movement.prototype.isValid = function(src, target) {
	if (!this.cond) {
		return;
	}
	if (this.count) {
		if (src.routineCnt++ < this.count) {
			return true;
		}
		src.routineCnt = 0;
		return false;
	}
	var dx = target.x - src.x;
	var dy = target.y - src.y;

	if (this.cond == Movement.COND.X && Math.abs(dx) <= src.speed) {
		return false;
	}
	if (this.cond == Movement.COND.Y && Math.abs(dy) <= src.speed) {
		return false;
	}
	return true;
};

Movement.prototype.tick = function(src, target) {
	this.list.forEach(function(gizmo) {
		gizmo.tick(src, target);
	});
	if (!this.isValid(src, target)) {
		src.routineIx++;
		if (src.routine.length <= src.routineIx) {
			src.routineIx = 0;
		}
	}
};
