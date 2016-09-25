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
function Motion(type, key, speed, h) {
	this.type = type;
	this.key = key;
	this.speed = speed;
	this.h = h;
	this.v = 0;
	this.x = 0;
	this.y = 0;
	this.triggerMin = Number.NaN;
	this.triggerMax = Number.NaN;
	this.reserve = null;
	this.filling = null;
	this.batter = 0;
}
Motion.TYPE = {
	NORMAL: 0,
	ONLY_ONE: 1,
	REWIND: 2
};

Motion.prototype.rotateV = function(v) {
	this.v = v;
	return this;
};

Motion.prototype.offsetX = function(x) {
	this.x = x;
	return this;
};

Motion.prototype.offsetY = function(y) {
	this.y = y;
	return this;
};

Motion.prototype.shot = function(type, id, trigger) {
	this.reserve = {type: type, id: id};
	if (isFinite(trigger)) {
		this.triggerMin = trigger;
		this.triggerMax = trigger + this.speed;
	} else {
		this.triggerMin = trigger.min;
		this.triggerMax = trigger.max;
	}
	return this;
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
	var next = this.ix + this.speed * this.dir;

	if (this.max <= next) {
		if (this.type != Motion.TYPE.REWIND) {
			return null;
		}
		this.ix = this.max;
		this.dir *= -1;
		return [this.mot[this.ix]];
	}
	if (next < 0) {
		return null;
	}
	var list = [];

	while (this.ix != next) {
		this.ix += this.dir;
		list.push(this.mot[this.ix]);
	}
	this.checkTrigger();
	return list;
};

Motion.prototype.checkTrigger = function() {
	if (this.filling) {
		return;
	}
	if (0 < this.batter) {
		this.batter = 0;
		return;
	}
	if (this.triggerMin <= this.ix && this.ix <= this.triggerMax) {
		this.filling = this.reserve;
		this.batter = 1;
	}
};

Motion.prototype.fire = function() {
	if (!this.filling) {
		return;
	}
	var result = this.filling;

	this.filling = null;
	return result;
};

//-----------------------------------------------------------------------------
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
	var prev = this.current.ix;
	var motion = this.current.next();

	if (motion == null) {
		this.ix++;
		if (this.max < this.ix) {
			this.ix = 0;
			this.loop++;
		}
		this.current = this.routine[this.ix].reset();
		if (0 < this.loop && this.current.type == Motion.TYPE.ONLY_ONE) {
			this.ix++;
			this.current = this.routine[this.ix].reset();
		}
		motion = this.current.next();

//var root = skeleton.data.root;
//console.log('root:' + root.pt.x + '/' + root.pt.y);
	}
	var direction = this.current.ix < prev ? -1 : 1;
	var filling = this.current.fire();

	skeleton.rotationH = this.current.h;
	skeleton.rotationV = this.current.v;
	skeleton.offsetX = this.current.x;
	skeleton.offsetY = this.current.y;
	skeleton.calcRotationMatrix();
	motion.forEach(function(m) {
		skeleton.shift(m, direction);
		skeleton.calculate();
	});
	return filling;
};
