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
		} else if (this.destination == Gizmo.DEST.ROTATE_R) {
			src.dir += src.step;
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
		if (this.destination == Gizmo.DEST.ROTATE) {
			var dist = src.calcDistance(target);

			if (src.speed < dist) {
				src.radian = Math.atan2(dy, dx);
			}
		}
		return;
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
