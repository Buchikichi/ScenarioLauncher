/**
 * Field.
 */
function Field() {
	this.lib = new Actor(this, 100, 100, 'img/lib.png');
	this.rab = new Actor(this, 120, 100, 'img/rab.png');
	this.actors = [this.lib, this.rab];
	this.points = [];
	this.init();
	this.resetParams();

	this.bg = new Image();
	this.bg.src = 'img/bg.png';
}
Field.WIDTH = 320;
Field.HEIGHT = 224;
Field.CENTER_Y = Field.HEIGHT / 2;
Field.MIN_Y = 32;
Field.MAX_Y = 200;
Field.POS_Z = 320;
Field.MAX_Z = 320;
Field.CELL_WIDTH = 32;
Field.PICKET_RADIUS = 2;
Field.PICKET = [
	[15, 60], [47, 60], [79, 60], [111, 60], [143, 60], [175, 60], [207, 60], [239, 60], [271, 60],
	[15, 92], [47, 92], [79, 92], [111, 92], [143, 92], [175, 92], [207, 92], [239, 92], [271, 92],
	[15, 124], [47, 124], [79, 124], [111, 124], [143, 124], [175, 124], [207, 124], [239, 124], [271, 124],
	[15, 156], [47, 156], [79, 156], [111, 156], [143, 156], [175, 156], [207, 156], [239, 156], [271, 156],
	[15, 188], [47, 188], [79, 188], [111, 188], [143, 188], [175, 188], [207, 188], [239, 188], [271, 188],
];

Field.prototype.resetParams = function() {
	this.x = 0;
	this.y = this.oy;
	this.z = 0;
this.dz = 6;
this.zzz = 0;
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

Field.prototype.inkey = function(keys) {
	this.lib.dx = 0;
	this.lib.dy = 0;
	this.rab.dx = 0;
	this.rab.dy = 0;

	if (keys['k83']) {
		this.lib.dx = -1;
	}
	if (keys['k70']) {
		this.lib.dx = 1;
	}
	if (keys['k69']) {
		this.lib.dy = -1;
	}
	if (keys['k68']) {
		this.lib.dy = 1;
	}
	if (keys['k37']) {
		this.rab.dx = -1;
	}
	if (keys['k39']) {
		this.rab.dx = 1;
	}
	if (keys['k38']) {
		this.rab.dy = -1;
	}
	if (keys['k40']) {
		this.rab.dy = 1;
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

Field.prototype.drawPicket = function() {
	var ctx = this.ctx;

	ctx.fillStyle = 'rgba(255, 143, 0, 1)';
//	ctx.fillStyle = 'rgba(255, 0, 0, .4)';
	Field.PICKET.forEach(function(pos) {
//console.log('x:' + pos[0]);
		ctx.beginPath();
		ctx.arc(pos[0], pos[1], 2, 0, Math.PI * 2, false);
		ctx.fill();
	});
};

Field.prototype.picketTest = function() {
	var ctx = this.ctx;
	var lib = this.lib;
	var rab = this.rab;
	var radian = Math.atan2(rab.y - lib.y, rab.x - lib.x);
	var bx = -Field.PICKET_RADIUS;
	var by = -Field.PICKET_RADIUS;
	var ex = Field.PICKET_RADIUS;
	var ey = Field.PICKET_RADIUS;

	if (lib.x < rab.x) {
		bx += lib.x;
		ex += rab.x;
	} else {
		bx += rab.x;
		ex += lib.x;
	}
	if (lib.y < rab.y) {
		by += lib.y;
		ey += rab.y;
	} else {
		by += rab.y;
		ey += lib.y;
	}

	ctx.save();
	ctx.fillStyle = 'rgba(256, 32, 32, .6)';
	ctx.lineWidth = .2;
	ctx.strokeStyle = 'rgba(256, 64, 64, .8)';
	Field.PICKET.forEach(function(pos) {
		var px = pos[0];
		var py = pos[1];

		if (px < bx || ex < px || py < by || ey < py) {
			return;
		}
		var dx = px - lib.x;
		var dy = py - lib.y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		var r2 = Math.atan2(dy, dx);
		var deg2 = parseInt(r2 * 180 / Math.PI);
		var r3 = radian - r2;
		var height = Math.sin(r3) * dist;
		var side = parseInt(Math.cos(r3) * dist);
		var sx = lib.x + Math.cos(radian) * side;
		var sy = lib.y + Math.sin(radian) * side;

		ctx.beginPath();
		ctx.arc(sx, sy, 1, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.fillText(parseInt(height), px, py);
		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(sx, sy);
		ctx.stroke();
	});
	ctx.restore();
};

Field.prototype.drawLines = function() {
	var ctx = this.ctx;

	ctx.strokeStyle = 'rgba(0, 174, 210, 1)';
	ctx.beginPath();
	ctx.moveTo(this.lib.x, this.lib.y);
	ctx.lineTo(this.rab.x, this.rab.y);
	ctx.stroke();
};

Field.prototype.drawActors = function() {
	var ctx = this.ctx;
	var field = this;

	this.actors.forEach(function(actor) {
		actor.move();
		actor.draw(ctx);
	});

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
	}
};

Field.prototype.calcPos = function(ax, ay, az) {
	var px = Math.cos(this.radY) * ax - Math.sin(this.radY) * az;
	var nz = Math.sin(this.radY) * ax + Math.cos(this.radY) * az;
	var py = Math.cos(this.radX) * ay - Math.sin(this.radX) * nz;
	var zoom = az * az / (Field.POS_Z * Field.POS_Z);

	return {px: px * zoom, py: py * zoom};
};

Field.prototype.draw = function() {
	var ctx = this.ctx;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.scale(this.magni, this.magni);
//	ctx.drawImage(this.bg, 0, 0);
	this.drawLines();
	this.drawPicket();
	this.drawActors();
this.picketTest();
	ctx.restore();
};
