/**
 * Landform.
 */
function Landform(canvas) {
	var landform = this;

	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.x = 0;
	this.y = 0;
	this.dir = 0;
	this.speed = 0;
	this.col = 0;
	this.colDir = 1;
	this.magni = 1;
	this.target = null;
	this.tx = 0;
	this.ty = 0;
	this.selection = 0;
	this.which = null;
	this.brick = null;
	this.brickVal = null;
	this.lastScan = null;
	this.touch = false;
	this.img = new Image();
	this.img.onload = function() {
		landform.x = 0;
		landform.width = this.width;
		landform.height = this.height;
		landform.bw = this.width / Landform.BRICK_WIDTH;
		landform.bh = this.height / Landform.BRICK_WIDTH;
	}
	this.isEdit = false;
	this.brick = null;
	this.touch = false;
}
Landform.BRICK_WIDTH = 8;
Landform.BRICK_HALF = Landform.BRICK_WIDTH / 2;
Landform.COL_MAX = 512;

Landform.prototype.load = function(file) {
	if (file instanceof File) {
		this.img.src = window.URL.createObjectURL(file);
	} else {
		this.img.src = file;
	}
};

Landform.prototype.loadMapData = function(file) {
	var landform = this;
	var img = new Image();

	img.onload = function() {
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');

		canvas.width = this.width;
		canvas.height = this.height;
		ctx.drawImage(img, 0, 0);
		landform.brick = ctx.getImageData(0, 0, this.width, this.height);
		landform.touch = true;
	}
	if (file instanceof File) {
		img.src = window.URL.createObjectURL(file);
	} else {
		img.src = file;
	}
};

/*
 * for play.
 */
Landform.prototype.forward = function() {
	this.x += Math.cos(this.dir) * this.speed;
	if (this.width < this.x) {
		this.x = -512;
	}
};

Landform.prototype.scanEnemy = function() {
	var result = [];
	var tx = Math.round(this.x / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	if (tx === this.lastScan) {
		return result;
	}
	this.lastScan = tx;
//	var ctx = this.ctx;

//	ctx.fillStyle = 'rgba(255, 0, 0, .8)';



	var right = Field.WIDTH;
	tx += right;
	if (tx < 0) {
		return result;
	}
	for (var ty = 0; ty < 224; ty += Landform.BRICK_WIDTH) {
		var brick = this.getBrick({x:right, y:ty}, 1);

		if (0 < brick) {
			result.push(Enemy.assign(brick - 1, right, ty + Landform.BRICK_WIDTH));
//console.log('brick:' + brick);
		}
//		ctx.fillRect(tx, ty, Landform.BRICK_WIDTH, Landform.BRICK_WIDTH - 2);
	}
	return result;
};

Landform.prototype.hitTest = function(target) {
	if (!this.brick) {
		return;
	}
	target.isHitWall = this.getBrick(target, 2);
	this.target = target;
};

Landform.prototype.getBrickIndex = function(target) {
	var tx = Math.round((this.x + target.x - Landform.BRICK_HALF) / Landform.BRICK_WIDTH);
	if (tx < 0 || this.bw < tx) {
		return -1;
	}
	var ty = Math.round((this.y + target.y - Landform.BRICK_HALF) / Landform.BRICK_WIDTH);

	return ty * this.bw * 4 + tx * 4;
};

Landform.prototype.getBrick = function(target, c) {
	if (!this.brick) {
		return null;
	}
	var ix = this.getBrickIndex(target);

	if (ix < 0) {
		return null;
	}
	return this.brick.data[ix + c];
};

/*
 * for edit
 */
Landform.prototype.putBrick = function(target, c, val) {
	var ix = this.getBrickIndex(target);

	if (ix < 0) {
		return;
	}
	this.brick.data[ix + c] = val;
	this.brick.data[ix + 3] = val ? 255 : 0;
};

Landform.prototype.drawEnemy = function(num, x, y) {
	var obj = Enemy.LIST[num - 1];
	var cnt = obj.formation ? 3 : 1;
	var enemy = obj.instance;

	if (!obj.instance) {
		return null;
	}
	enemy.x = x + enemy.hW;
	enemy.y = y + enemy.hH;
	while (cnt--) {
		enemy.draw(this.ctx);
		enemy.x += 2;
		enemy.y += 2;
	}
	return enemy;
};

Landform.prototype.drawTarget = function() {
	if (!this.isEdit || !this.target) {
		return;
	}
	var tx = Math.round((this.x + this.target.x - Landform.BRICK_HALF) / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	var ty = Math.round((this.y + this.target.y - Landform.BRICK_HALF) / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	var ctx = this.ctx;
	var bw = Landform.BRICK_WIDTH;

	if (0 < this.selection) {
		var enemy = this.drawEnemy(this.selection, tx, ty);

		if (enemy) {
			bw = enemy.width;
		}
	}
	ctx.save();
	ctx.fillStyle = 'rgba(128, 255, 255, .4)';
	ctx.fillRect(tx, ty, bw, bw);
	ctx.restore();
	this.touchDown(tx, ty);
};

Landform.prototype.touchDown = function(tx, ty) {
	if (!this.which) {
		this.tx = -1;
		this.ty = -1;
		this.brickVal = null;
		return;
	}
	if (this.tx == tx && this.ty == ty) {
		return;
	}
	if (0 < this.selection) {
		var brick = this.getBrick(this.target, 1);

		if (!brick || brick != this.selection) {
			this.putBrick(this.target, 1, this.selection);
		} else {
			this.putBrick(this.target, 1, 0);
		}
	} else {
		var brick = this.getBrick(this.target, 2);

		if (this.brickVal == null) {
			this.brickVal = 0 < brick ? 0 : 255;
		}
		this.putBrick(this.target, 2, this.brickVal);
	}
	this.touch = true;
	this.tx = tx;
	this.ty = ty;
};

Landform.prototype.drawBrick = function() {
	if (!this.brick || !this.isEdit) {
		return;
	}
	var ctx = this.ctx;
	var red = 255 < this.col ? this.col - 256 : 0;
	var green = 255 < this.col ? 255 : this.col % 256;
	var brickWidth = Landform.BRICK_WIDTH - 2;
	var sx = Math.round(this.x / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	var startX = sx / Landform.BRICK_WIDTH;
	var endX = Math.min(startX + 512 / Landform.BRICK_WIDTH, this.bw);
	var bd = this.brick.data;

	ctx.save();
	ctx.fillStyle = 'rgba(' + red + ', ' + green + ', 255, .4)';
	for (var y = 0, ry = 0; y < this.bh; y++, ry += Landform.BRICK_WIDTH) {
		var ix = (y * this.bw + startX) * 4;

		for (var x = startX, rx = sx; x < endX; x++, rx += Landform.BRICK_WIDTH, ix += 4) {
			if (x < 0) {
				continue;
			}
			var enemyNum = bd[ix + 1];
			if (enemyNum) {
				this.drawEnemy(enemyNum, rx, ry);
			}
			if (bd[ix + 2] == 255) {
				ctx.fillRect(rx, ry, brickWidth, brickWidth);
			}
		}
	}
	ctx.restore();
	this.col += this.colDir * 16;
	if (this.col <= 0 || Landform.COL_MAX <= this.col) {
		this.colDir *= -1;
	}
};

Landform.prototype.draw = function() {
	if (!this.img.src || !this.img.complete) {
		return;
	}
	var ctx = this.ctx;

	ctx.save();
	ctx.scale(this.magni, this.magni);
	ctx.translate(-this.x, this.y);
	ctx.drawImage(this.img, 0, 0);
	this.drawBrick();
	this.drawTarget();
//this.scanEnemy();
	ctx.restore();
	if (this.touch && this.brick) {
		this.updateMap();
		this.touch = false;
	}
};

Landform.prototype.updateMap = function() {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	canvas.width = this.brick.width;
	canvas.height = this.brick.height;
	ctx.putImageData(this.brick, 0, 0);
	$('#mapImage').attr('src', canvas.toDataURL('image/png'));
};

Landform.prototype.getImageData = function() {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	canvas.width = this.width;
	canvas.height = this.height;
	ctx.drawImage(this.img, 0, 0);
	return ctx.getImageData(0, 0, this.width, this.height);
};

Landform.prototype.generateBrick = function(ctx) {
	if (!this.img.src || !this.img.complete) {
		return;
	}
	var img = this.getImageData();
	var bw = this.width / Landform.BRICK_WIDTH;
	var bh = this.height / Landform.BRICK_WIDTH;
	var brick = ctx.createImageData(bw, bh);
	var dst = brick.data;
	var sx = 0;
	var ix = 0;

console.log(this.width + ' x ' + this.height + ' | ' + (this.width * this.height * 4));
console.log(bw + ' x ' + bh + ' | ' + dst.length);
	for (var y = 0; y < bh; y++) {
		for (var x = 0; x < bw; x++) {
			var dot = false;

			for (var c = 0; c < 4; c++) {
				if (img.data[sx + c]) {
					dot = true;
				}
			}
			var val = dot ? 255 : 0;
			dst[ix + 2] = val;
			dst[ix + 3] = val;
			sx += Landform.BRICK_WIDTH * 4;
			ix += 4;
		}
		sx += this.width * (Landform.BRICK_WIDTH - 1) * 4;
	}
console.log('ix:' + ix);
console.log('sx:' + sx);
	this.brick = brick;
	this.touch = true;
};
