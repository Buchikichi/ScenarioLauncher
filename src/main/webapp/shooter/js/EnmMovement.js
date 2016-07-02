/**
 * Gizmo.
 */
function Gizmo(type, destination) {
	this.type = type;
	this.destination = destination;
}
Gizmo.TYPE_OWN = 0;
Gizmo.TYPE_AIM = 1;
Gizmo.TYPE_CHASE = 2;

Gizmo.prototype.calc = function(src, target) {
	var dir = null;
	var dx = target.x - src.x;
	var dy = target.y - src.y;

	if (Math.abs(dx) <= src.speed) {
		dx = 0;
	}
	if (Math.abs(dy) <= src.speed) {
		dy = 0;
	}
//console.log('dx:' + dx);
	if (this.type == Gizmo.TYPE_CHASE) {
		if (this.destination == 'x' && dx) {
			dir = Math.atan2(0, dx);
		} else if (this.destination == 'y' && dy) {
			dir = Math.atan2(dy, 0);
		}
		if (dir) {
			src.radian = dir;
		}
	}
	return dir;
};

/**
 * Movement.
 */
function Movement(cond) {
	this.cond = cond;
	this.list = [];
}

Movement.prototype.add = function(type, target) {
	this.list.push(new Gizmo(type, target));
	return this;
};
