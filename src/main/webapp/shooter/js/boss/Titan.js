/**
 * Titan.
 */
class Titan extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		let asf = Object.assign({}, MotionManager.INSTANCE.dic['asf']);

		this.scale = 7;
		this.hitPoint = Number.MAX_SAFE_INTEGER;
		//
		this.motionRoutine = new MotionRoutine([
			new Motion(Motion.TYPE.ONLY_ONE, '111_7.amc', 2, Math.PI / 4).offsetX(0).offsetY(0),
			new Motion(Motion.TYPE.NORMAL, '79_96.amc', 1, -Math.PI * .4)
				.shot(TitanShot, ['lradius', 'lwrist', 'lhand', 'lthumb', 'lfingers'], 200), // shot
			new Motion(Motion.TYPE.REWIND, '133_01.amc', 2, Math.PI)
				.shot(TitanBullet, ['thorax', 'upperneck'], {min:200, max:550}), // crawl
			new Motion(Motion.TYPE.NORMAL, '79_91.amc', 1, -Math.PI * .4)
				.shot(TitanBall, ['rhumerus', 'rradius', 'rwrist', 'rhand'], {min:175, max:200}), // throw
			new Motion(Motion.TYPE.NORMAL, '86_01b.amc', 2, Math.PI)
				.shot(Bullet, ['lfingers', 'rfingers'], {min:0, max:1000}), // jump
		]);
		if (asf) {
			this.skeleton = new Skeleton(asf);
			this.setupBone(field);
		}
	}

	setupBone(field) {
		let map = this.skeleton.map;
		let boneMap = {};

		Object.keys(map).forEach(function(key) {
			if (key == 'root') {
				return;
			}
			let titanBone = new TitanBone(field, 0, 0);
			let img = 'boss/titan/' + key + '.png';

			titanBone.anim = new Animator(titanBone, img, Animator.TYPE.NONE);
			if (key == 'lowerback') {
				titanBone.hitPoint = Titan.HIT_POINT;
			}
			titanBone.id = key;
			boneMap[key] = titanBone;
		});
		this.boneMap = boneMap;
		this.appears = false;
	}

	eject() {
		super.eject();
		Object.keys(this.boneMap).forEach((key)=> {
			let bone = this.boneMap[key];

			bone.hitPoint = 0;
			bone.explosion = Actor.MAX_EXPLOSION * 2;
		});
	}

	move(target) {
		let list = [];
		let titan = this;
		let skeleton = this.skeleton;
		let filling = this.motionRoutine.next(skeleton);

		super.move(target);
		if (!this.appears) {
			Object.keys(this.boneMap).forEach(function(key) {
				list.push(titan.boneMap[key]);
			});
			this.appears = true;
			return list.reverse();
		}
		let map = this.skeleton.map;
		let isDestroy = false;

		if (filling) {
			filling.id.forEach(function(id) {
				let titanBone = titan.boneMap[id];
				let shot = new filling.type(titan.field, titanBone.x, titanBone.y);

				shot.dir = titanBone.radian;
				list.push(shot);
			});
		}
		Object.keys(this.boneMap).forEach(function(key) {
			let bone = map[key];
			let x = bone.cx * titan.scale + titan.x;
			let y = bone.cy * titan.scale + titan.y;
			let titanBone = titan.boneMap[key];

			titanBone.x = x;
			titanBone.y = y;
			titanBone.z = bone.cz;
			titanBone.radian = bone.radian;
			titanBone.constraint = true;
			if (titanBone.hitPoint == 0) {
				isDestroy = true;
			}
		});
		if (isDestroy) {
			this.eject();
		}
		return list;
	}

	drawInfo(ctx) {
		let motion = this.motionRoutine.current;
		let lowerback = this.boneMap['lowerback'];

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.strokeText('ix:' + motion.ix, 0, 0);
		ctx.strokeText('hp:' + lowerback.hitPoint, 0, 10);
		ctx.restore();
	}

	drawNormal(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
		if (this.skeleton) {
			ctx.scale(this.scale, this.scale);
			// skeleton
			ctx.strokeStyle = 'rgba(203, 152, 135, 0.2)';
			this.skeleton.draw(ctx);
		}
		ctx.restore();
		this.drawInfo(ctx);
	}

	isHit(target) {
		return false;
	}
}
Titan.HIT_POINT = 292;


//-----------------------------------------------------------------------------
/**
 * TitanBone.
 */
class TitanBone extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.hasBounds = false;
		this.hitPoint = Number.MAX_SAFE_INTEGER;
		this.filling = null;
	}

	trigger() {}

	drawNormal(ctx) {
		super.drawNormal(ctx);
//		ctx.save();
//		ctx.translate(this.x, this.y);
//		ctx.beginPath();
//		ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
//		ctx.strokeText(this.id, 0, 0);
//		ctx.restore();
	}
}
