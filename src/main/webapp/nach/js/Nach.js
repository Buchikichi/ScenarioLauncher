/**
 * Nach.
 */
function Nach(field, x, y) {
	Actor.apply(this, arguments);
	this.dx = 0;
	this.dy = 0;
	this.speed = 4;
	this.width = 64;
	this.height = 32;
	this.jumping = 0;
	this.rad = 0;
	this.anim = 0;
	this.recalculation();
	this.maxX = this.field.width / 2;
	this.maxY = this.field.height - this.height;
	this.img.src = 'img/nach001.png';
}
Nach.prototype = Object.create(Actor.prototype);
Nach.prototype.MAX_JUMPING = 5;

Nach.prototype.movePlus = function() {
	if (this.x < 0 || this.maxX < this.x) {
		this.x = this.svX;
	}
	this.dy += .3;
	if (this.maxY < this.y) {
		this.dy = 0;
		this.y = this.maxY;
	}
//	if (this.jumping < 2) {
		this.anim += .1 + this.x / 2000;
		this.anim %= 8;
//	}
};

Nach.prototype.jump = function() {
	if (this.jumping < this.MAX_JUMPING) {
		this.jumping++;
		this.dy -= 1;
	}
};

Nach.prototype.letdown = function() {
	this.jumping = this.MAX_JUMPING;
};

Nach.prototype.land = function(ground) {
	var top = ground.h - this.height;

	if (top < this.y) {
		this.y = top;
		this.dy = 0;
		this.jumping = 0;
		this.rad = ground.rad;

		this.svX = this.x;
		var dx = Math.sin(this.rad) * 2;
		if (0 < dx) {
			dx *= 4;
		}
		this.x += dx;
		this.movePlus();
		//this.y = -Math.sin(this.rad);
	}
};

Nach.prototype.drawNormal = function(ctx) {
	var posX = -this.hW;
	var posY = -this.hH + 4;
	var anim = parseInt(this.anim);
	var oy = Math.abs(anim - 4) * this.height + 1;

	ctx.save();
	ctx.translate(this.x + this.hW, this.y + this.hH);
	ctx.rotate(this.rad);
	ctx.drawImage(this.img, 0, oy, this.width, this.height, posX, posY, this.width, this.height);
	ctx.restore();
};
