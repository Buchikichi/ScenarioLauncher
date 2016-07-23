function Animator(actor, src, type) {
	var anim = this;
	var len = arguments.length;

	this.actor = actor;
	this.type = type;
	this.numX = 3 < len ? arguments[3] : 1;
	this.numY = 4 < len ? arguments[4] : 1;
	this.patNum = 0;
	this.img = new Image();
	this.img.onload = function() {
		anim.width = this.width / anim.numX;
		anim.height = this.height / anim.numY;
		anim.hW = anim.width / 2;
		anim.hH = anim.height / 2;
		actor.width = anim.width;
		actor.height = anim.height;
		actor.hW = anim.hW;
		actor.hH = anim.hH;
		if (actor.recalculation) {
			actor.recalculation();
		}
	};
	this.img.src = 'img/' + src;
}
Animator.TYPE = {
	NONE: 0,
	X: 1,
	Y: 2,
	XY: 3,
	H: 4,
	V: 5,
};

Animator.prototype.next = function(dir) {
	if (this.type == Animator.TYPE.V && .1 < Math.abs(this.patNum)) {
		if (this.patNum < 0) {
			this.patNum += .1;
		} else {
			this.patNum -= .1;
		}
	}
	if (dir != null) {
		if (this.type == Animator.TYPE.V) {
			var limit = Math.floor(this.numY / 2);

			this.patNum += Math.sin(dir) / 3;
			if (this.patNum < -limit) {
				this.patNum = -limit;
			} else if (limit < this.patNum) {
				this.patNum = limit;
			}
		} else if (this.type == Animator.TYPE.Y) {
			this.patNum += Math.sin(dir);

			if (this.patNum < 0) {
				this.patNum = this.numY - 1;
			} else if (this.numY < this.patNum) {
				this.patNum = 0;
			}
		}
	}
	//this.patNum = Math.round(this.patNum, 3);
	this.patNum *= 1000;
	this.patNum = Math.round(this.patNum) / 1000;
//console.log('patNum:' + this.patNum);
};

Animator.prototype.draw = function(ctx) {
	var actor = this.actor;
	var sw = this.width;
	var sh = this.height;
	var sx = 0;
	var sy = 0;

	if (this.type == Animator.TYPE.V) {
		sy = sh * (parseInt(this.patNum) + (this.numY ? parseInt(this.numY / 2) : 0));
	} else if (this.type == Animator.TYPE.Y) {
		sy = sh * parseInt(this.patNum);
	}
	ctx.save();
	ctx.translate(actor.x, actor.y);
	ctx.rotate(actor.radian);
	if (actor.scale) {
		ctx.scale(actor.scale, actor.scale);
	}
	ctx.drawImage(this.img, sx, sy, sw, sh, -this.hW, -this.hH, sw, sh);
	ctx.restore();
};
