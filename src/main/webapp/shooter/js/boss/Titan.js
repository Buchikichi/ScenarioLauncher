/**
 * Titan.
 */
function Titan(field, x, y) {
	Enemy.apply(this, arguments);
	var asf = MotionManager.INSTANCE.dic['asf'];

	this.scale = 7;
	this.hitPoint = Number.MAX_SAFE_INTEGER;
	//
	this.motionRoutine = new MotionRoutine([
		new Motion(Motion.TYPE.ONLY_ONE, '111_7.amc', 10/*3*/, Math.PI / 4).offsetX(4).offsetY(-13),
		new Motion(Motion.TYPE.NORMAL, '79_96.amc', 3, -Math.PI * .4)
			.shot('lhand', TitanShot, 200), // shot
		new Motion(Motion.TYPE.NORMAL, '79_91.amc', 3, -Math.PI * .4), // throw
		new Motion(Motion.TYPE.REWIND, '133_01.amc', 3, Math.PI).offsetX(-19)
			.shot('upperneck', TitanBullet, {min:400, max:600}), // crawl
		new Motion(Motion.TYPE.NORMAL, '86_01b.amc', 3, Math.PI).offsetX(34), // jump
	]);
	if (asf) {
		this.skeleton = new Skeleton(asf);
		this.setupBone(field);
	}
}
Titan.prototype = Object.create(Enemy.prototype);
Titan.HIT_POINT = 100;

Titan.prototype.setupBone = function(field) {
	var map = this.skeleton.map;
	var boneMap = {};

	Object.keys(map).forEach(function(key) {
		if (key == 'root') {
			return;
		}
		var titanBone = new TitanBone(field, 0, 0);
		var img = 'boss/titan/' + key + '.png';

		titanBone.anim = new Animator(titanBone, img, Animator.TYPE.NONE);
		if (key == 'lowerback') {
			titanBone.hitPoint = Titan.HIT_POINT;
		}
		titanBone.id = key;
		boneMap[key] = titanBone;
	});
	this.boneMap = boneMap;
	this.appears = false;
};

Titan.prototype._eject = Actor.prototype.eject;
Titan.prototype.eject = function() {
	var titan = this;

	this._eject();
	Object.keys(this.boneMap).forEach(function(key) {
		var bone = titan.boneMap[key];

		bone.hitPoint = 0;
		bone.explosion = Actor.MAX_EXPLOSION * 2;
	});
};

Titan.prototype._move = Enemy.prototype.move;
Titan.prototype.move = function(target) {
	var list = [];
	var titan = this;
	var skeleton = this.skeleton;
	var filling = this.motionRoutine.next(skeleton);

	this._move(target);
	if (!this.appears) {
		Object.keys(this.boneMap).forEach(function(key) {
			list.push(titan.boneMap[key]);
		});
		this.appears = true;
		return list.reverse();
	}
	var map = this.skeleton.map;
	var isDestroy = false;

	if (filling) {
		var titanBone = titan.boneMap[filling.id];
		var shot = new filling.type(this.field, titanBone.x, titanBone.y);

		shot.dir = titanBone.radian;
		list.push(shot);
	}
	Object.keys(this.boneMap).forEach(function(key) {
		var bone = map[key];
		var x = bone.cx * titan.scale + titan.x;
		var y = bone.cy * titan.scale + titan.y;
		var titanBone = titan.boneMap[key];

		titanBone.x = x;
		titanBone.y = y;
		titanBone.radian = bone.radian;
		if (titanBone.hitPoint == 0) {
			isDestroy = true;
		}
	});
	if (isDestroy) {
		this.eject();
	}
	return list;
};

Titan.prototype.drawNormal = function(ctx) {
	var titan = this;

	ctx.save();
	ctx.translate(this.x, this.y);
	if (this.skeleton) {
		ctx.scale(this.scale, this.scale);
		// skeleton
		ctx.strokeStyle = 'rgba(203, 152, 135, 0.2)';
		this.skeleton.draw(ctx);
	}
	ctx.restore();
	//
	ctx.save();
	var motion = this.motionRoutine.current;
	ctx.translate(this.x, this.y);
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
	ctx.strokeText('ix:' + motion.ix, 0, 0);
	ctx.restore();
};

Titan.prototype.isHit = function(target) {
	return false;
};


//-----------------------------------------------------------------------------
/**
 * TitanBone.
 */
function TitanBone(field, x, y) {
	Enemy.apply(this, arguments);

	this.margin = Field.WIDTH;
	this.hitPoint = Number.MAX_SAFE_INTEGER;
	this.filling = null;
}
TitanBone.prototype = Object.create(Enemy.prototype);

//TitanBone.prototype._drawNormal = Enemy.prototype.drawNormal;
//TitanBone.prototype.drawNormal = function(ctx) {
//	this._drawNormal(ctx);
//	ctx.save();
//	ctx.translate(this.x, this.y);
//	ctx.beginPath();
//	ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
//	ctx.strokeText(this.id, 0, 0);
//	ctx.restore();
//};
