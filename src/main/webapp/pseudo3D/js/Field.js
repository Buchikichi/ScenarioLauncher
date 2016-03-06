/**
 * Field.
 */
function Field() {
	this.hero = null;
	this.actors = [];
	this.init();
	this.resetParams();
}
Field.WIDTH = 320;
Field.HEIGHT = 224;
Field.CENTER_Y = Field.HEIGHT / 2;
Field.MIN_Y = 32;
Field.MAX_Y = 200;
Field.POS_Z = 320;
Field.MAX_Z = 320;
Field.CELL_WIDTH = 32;
Field.BOX = [
	[0, 0, 0], [0, 32, 0], [32, 32, 0], [32, 0, 0], [0, 0, 0],
	[0, 0, 32], [0, 32, 32], [32, 32, 32], [32, 0, 32], [0, 0, 32]
];

Field.prototype.resetParams = function() {
	this.x = 0;
	this.y = this.oy;
	this.z = 0;
this.dz = 6;
this.zzz = 0;
	this.fill = 'rgba(164, 247, 164, 1)';
	this.fillV = 'rgba(115, 197, 115, 1)';
	this.fillH = 'rgba(140, 225, 140, .8)';
};

Field.prototype.init = function() {
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.ox = Field.WIDTH / 2;
	this.oy = Field.HEIGHT / 2;
	this.resize(1);
};
Field.prototype.resize = function(magni) {
	var canvas = $(this.canvas);

	this.width = Field.WIDTH * magni;
	this.height = Field.HEIGHT * magni;
	this.cx = this.width / 2;
	this.cy = this.height / 2;
	this.magni = magni;
	canvas.attr('width', this.width);
	canvas.attr('height', this.height);
};
Field.prototype.addActor = function(actor) {
	if (actor instanceof Hero) {
		this.hero = actor;
	} else {
		this.actors.push(actor);
	}
};

Field.prototype.moveH = function(delta) {
	this.x += delta;
	this.x %= 64;
};

Field.prototype.moveV = function(delta) {
	this.y -= delta;
	if (this.y < Field.MIN_Y) {
		this.y = Field.MIN_Y;
	} else if (Field.MAX_Y < this.y) {
		this.y = Field.MAX_Y;
	}
};

Field.prototype.drawGround = function() {
	var ctx = this.ctx;

	ctx.fillStyle = this.fill;
	ctx.fillRect(0, this.y, Field.WIDTH, Field.HEIGHT - this.y);
	// Vertical line
	ctx.fillStyle = this.fillV;
	for (var cnt = -80; cnt <= 80; cnt += 2) {
		var lx = this.ox / 2 + cnt * 32 + this.x;
		var rx = lx + 32;
		ctx.beginPath();
		ctx.moveTo(this.ox, this.y);
		ctx.lineTo(lx, Field.HEIGHT);
		ctx.lineTo(rx, Field.HEIGHT);
		ctx.closePath();
		ctx.fill();
	}
	// Horizontal line
	this.radX = Math.atan2(this.hero.y - Field.CENTER_Y, Field.MAX_Z);
	this.radY = Math.atan2(this.hero.x, Field.POS_Z);
	ctx.fillStyle = this.fillH;
	for (var cnt = 0; cnt < Field.MAX_Z; cnt += Field.CELL_WIDTH) {
		var tz = cnt + this.z;
		var bz = tz + Field.CELL_WIDTH / 2;
		var top = this.calcPos(0, 0, tz);
		var bottom = this.calcPos(0, 0, bz);
		var py = top.py + this.y;
		var height = bottom.py - top.py;

		ctx.fillRect(0, py, Field.WIDTH, height);
	}
	this.z += 6;
	if (Field.CELL_WIDTH < this.z) {
		this.z %= Field.CELL_WIDTH;
	}
	this.zzz += this.dz;
	if (Field.MAX_Z < this.zzz) {
		this.zzz = Field.MAX_Z;
		this.dz *= -1;
	}
	if (this.zzz < 0) {
		this.zzz = 0;
		this.dz *= -1;
	}
};

Field.prototype.drawActors = function() {
	var ctx = this.ctx;
	var field = this;
	var validActors = [];

	ctx.save();
	ctx.translate(this.ox, this.y);
	this.actors.reverse();
	this.actors.forEach(function(actor) {
		if (actor.isGone) {
			return;
		}
		actor.move();
		actor.draw(ctx);
		validActors.push(actor);
	});
	ctx.restore();
	this.actors = validActors;
	this.actors.reverse();

	var diffH = -this.hero.x;
	var diffV = this.y - this.oy - this.hero.y;

	field.moveH(diffH / 6);
	field.moveV(diffV / 5);

	var rnd = parseInt(Math.random() * 5);
	if (rnd == 0) {
		var type = parseInt(Math.random() * 2);
		var x = parseInt(Math.random() * 10) - 5;

		if (type == 0) {
			var y = 1;
			var img = 'img/tree001.png';
		} else {
			var y = parseInt(Math.random() * 5) + 1;
			var img = 'img/stone001.png';
		}
		var struc = new Structure(field, x * 32, y * 32, 0, img);

		this.actors.push(struc);
	}
};

Field.prototype.drawHero = function() {
	var ctx = this.ctx;

	ctx.save();
	ctx.translate(this.ox, this.oy);
	this.hero.move();
	this.hero.draw(ctx);
	ctx.restore();
};

Field.prototype.calcPos = function(ax, ay, az) {
	var px = Math.cos(this.radY) * ax - Math.sin(this.radY) * az;
	var nz = Math.sin(this.radY) * ax + Math.cos(this.radY) * az;
	var py = Math.cos(this.radX) * ay - Math.sin(this.radX) * nz;
	var zoom = az * az / (Field.POS_Z * Field.POS_Z);

	return {px: px * zoom, py: py * zoom};
};

Field.prototype.drawBox = function() {
	var field = this;
	var ctx = this.ctx;
	var zzz = this.zzz;
	var first = true;
	var degX = this.radX * 180 / Math.PI;

	ctx.fillStyle = 'rgba(32, 32, 32, .7)';
	ctx.fillText('actors:' + this.actors.length, 0, 10);
	ctx.fillText('degX:' + degX, 0, 20);
	ctx.save();
	ctx.translate(this.ox, this.y);
	ctx.beginPath();
	ctx.strokeStyle = 'rgba(128, 0, 0, 1)';
	Field.BOX.forEach(function(box) {
		var ax = box[0] - 16;
		var ay = -box[1] * 2;
		var az = box[2] - 16 + zzz;
		var pos = field.calcPos(ax, ay, az);
		var px = pos.px;
		var py = pos.py;

		if (first) {
			first = false;
			ctx.arc(px, py, 1, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.moveTo(px, py);
		} else {
			ctx.lineTo(px, py);
		}
	});
	ctx.stroke();
	ctx.restore();
};

Field.prototype.draw = function() {
	var ctx = this.ctx;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.scale(this.magni, this.magni);
	this.drawGround();
	this.drawActors();
//	this.drawBox();
	this.drawHero();
	ctx.restore();
};
