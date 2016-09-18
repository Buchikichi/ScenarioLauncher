/**
 * MotionManager.
 */
'use strict';
function MotionManager() {
	Repository.apply(this, arguments);
}
MotionManager.prototype = Object.create(Repository.prototype);
MotionManager.INSTANCE = new MotionManager();

MotionManager.prototype.makeName = function(key) {
	return 'motion/' + key + '.json';
};

//-----------------------------------------------------------------------------
/**
 * Motion.
 */
function Motion(type, key, speed, h, v) {
	this.type = type;
	this.key = key;
	this.speed = speed;
	this.h = h;
	this.v = v;
}
Motion.TYPE = {
	NORMAL: 0,
	ONLY_ONE: 1,
	REWIND: 2
};

Motion.prototype.reset = function() {
	this.mot = MotionManager.INSTANCE.dic[this.key];
	if (this.mot) {
		this.max = this.mot.length - 1;
	}
	this.ix = 0;
	this.dir = 1;
	return this;
};

Motion.prototype.next = function() {
	this.ix += this.speed * this.dir;
	if (this.max <= this.ix) {
		if (this.type != Motion.TYPE.REWIND) {
			return null;
		}
		this.ix = this.max;
		this.dir *= -1;
	}
	if (this.ix < 0) {
		return null;
	}
	return this.mot[this.ix];
};

/**
 * MotionRoutine.
 */
function MotionRoutine(routine) {
	this.routine = routine;
	this.ix = 0;
	this.max = this.routine.length - 1;
	this.loop = 0;
	this.current = this.routine[this.ix].reset();
}

MotionRoutine.prototype.next = function(skeleton) {
	var motion = this.current.next();

	if (motion == null) {
		this.ix++;
		if (this.max <= this.ix) {
			this.ix = 0;
			this.loop++;
		}
		this.current = this.routine[this.ix].reset();
		if (0 < this.loop && this.current.type == Motion.TYPE.ONLY_ONE) {
			this.ix++;
			this.current = this.routine[this.ix].reset();
		}
		motion = this.current.next();
	}
	skeleton.rotationH = this.current.h;
	skeleton.rotationV = this.current.v;
	skeleton.calcRotationMatrix();
	skeleton.shift(motion);
	return motion;
};
