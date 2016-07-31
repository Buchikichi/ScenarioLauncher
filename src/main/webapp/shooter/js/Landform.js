/**
 * Landform.
 */
function Landform(canvas) {
	var landform = this;

	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.x = 0;
	this.y = 0;
	this.viewY = 0;
	this.dir = 0;
	this.speed = 0;
	this.scroll = Stage.SCROLL.OFF;
	this.effectH = 0;
	this.effectV = 0;
	this.next = Landform.NEXT.NONE;
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
		landform.width = this.width;
		landform.height = this.height;
		landform.bw = this.width / Landform.BRICK_WIDTH;
		landform.bh = this.height / Landform.BRICK_WIDTH;
		landform.viewX = this.width - Field.HALF_WIDTH;
		landform.viewY = this.height - Field.HEIGHT;
		landform.arrivX = this.width - Field.WIDTH;
		landform.noticeX = landform.arrivX - Field.HALF_WIDTH;
	}
	this.reverse = new Image();
	this.reverse.src = './img/reverse.png';
	this.isEdit = false;
	this.touch = false;
}
Landform.BRICK_WIDTH = 8;
Landform.BRICK_HALF = Landform.BRICK_WIDTH / 2;
Landform.COL_MAX = 512;
Landform.NEXT = {
	NONE: 0,
	NOTICE: 1,
	ARRIV: 2,
	PAST: 3
};

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

Landform.prototype.loadStage = function(stage) {
	var landform = this;

	this.reset();
	this.scroll = stage.scroll;
	this.loadMapData('./img/' + stage.map);
	var divList = document.getElementsByClassName('bg');
	for (var cnt = 0; cnt < divList.length; cnt++) {
		var div = divList[cnt];

		div.style.backgroundImage = 'none';
		div.setAttribute('data-x', 0);
		div.setAttribute('data-y', 0);
	}
	stage.background.forEach(function(bg, ix) {
		if (ix == 0) {
			landform.speed = bg.speed;
			landform.load('./img/' + bg.img);
			return;
		}
		// background-image: url("../img/stage01bg1.png");
		var div = document.getElementById('bg' + ix);

		div.style.backgroundImage = 'url("./img/' + bg.img + '")';
		div.setAttribute('data-speed', bg.speed);
	});
};

/*
 * for play.
 */
Landform.prototype.reset = function() {
	this.x = -Field.WIDTH;
	this.y = 0;
};

Landform.prototype.effect = function(target) {
	var maxX = Math.max(target.field.width + target.width, target.maxX);

	if (target.effect) {
		target.x -= this.effectH;
	}
	target.y += this.effectV;
	if (target.x < target.minX || maxX < target.x) {
		target.eject();
	}
	if (this.scroll == Stage.SCROLL.OFF) {
		if (target.y < target.minY || target.maxY < target.y) {
			target.eject();
		}
		return;
	}
	if (this.scroll == Stage.SCROLL.ON) {
		if (target.y < -this.height || this.height + target.maxY < target.y) {
			target.eject();
		}
		return;
	}
	if (target.y < 0) {
		target.y += this.height;
	} else if (this.height < target.y) {
		target.y -= this.height;
	}
};

Landform.prototype.scrollV = function(target) {
	this.effectV = 0;
	if (this.scroll == Stage.SCROLL.OFF) {
		return;
	}
	var field = target.field;
	var diff = field.hH - target.y;
	var svY = this.y;

	if (Math.abs(diff) < this.speed) {
		return;
	}
	var speed = diff / 3;

	this.y -= speed;
	if (this.scroll == Stage.SCROLL.ON) {
		if (this.y < 0 || this.viewY < this.y) {
			this.y = svY;
			return;
		}
	} else {
		if (this.y < 0) {
			this.y += this.height;
		} else if (this.height < this.y) {
			this.y -= this.height;
		}
	}
	this.effectV = speed;
};

Landform.prototype.forwardBg = function(target) {
	var divList = document.getElementsByClassName('bg');

	for (var cnt = 0; cnt < divList.length; cnt++) {
		var div = divList[cnt];
		var speed = parseFloat(div.getAttribute('data-speed'));
		if (!speed) {
			continue;
		}
		var ratio = this.speed / speed;
		var x = parseFloat(div.getAttribute('data-x'));
		var y = parseFloat(div.getAttribute('data-y'));
		var position = -x + 'px ' + -y + 'px';

		div.style.backgroundPosition = position;
		x += speed;
		y += -this.effectV / ratio;
		div.setAttribute('data-x', x);
		div.setAttribute('data-y', y);
	}
};

Landform.prototype.forward = function(target) {
	if (!this.width) {
		return Landform.NEXT.NONE;
	}
	this.scrollV(target);
	this.forwardBg();
	if (this.viewX <= this.x) {
		this.effectH = 0;
		if (this.next != Landform.NEXT.PAST) {
			this.next = Landform.NEXT.PAST;
			return Landform.NEXT.PAST;
		}
		return Landform.NEXT.NONE;
	}
	this.effectH = Math.cos(this.dir) * this.speed;
	this.x += this.effectH;
	if (this.arrivX <= this.x) {
		if (this.next != Landform.NEXT.ARRIV) {
			this.x = this.width - Field.WIDTH;
			this.effectH = 0;
			this.next = Landform.NEXT.ARRIV;
			return Landform.NEXT.ARRIV;
		}
	} else if (this.noticeX <= this.x) {
		if (this.next != Landform.NEXT.NOTICE) {
			this.next = Landform.NEXT.NOTICE;
			return Landform.NEXT.NOTICE;
		}
	}
	return Landform.NEXT.NONE;
};

Landform.prototype.scanEnemy = function() {
	var result = [];

	if (!this.brick || this.width - Field.WIDTH <= this.x) {
		return result;
	}
	// right
	var tx = Math.round((this.x + Field.WIDTH - Landform.BRICK_HALF) / Landform.BRICK_WIDTH);

	if (tx < 0) {
		return result;
	}
	if (tx === this.lastScan) {
		return result;
	}
	this.lastScan = tx;
	var x = Field.WIDTH + Landform.BRICK_WIDTH;
	for (var ty = 0; ty < this.bh; ty++) {
		var ix = ty * this.bw * 4 + tx * 4;
		var brick = this.brick.data[ix + 1];

		if (0 < brick && brick <= Enemy.MAX_TYPE) {
			var y = -this.y + (ty + 1) * Landform.BRICK_WIDTH;

			result.push(Enemy.assign(brick - 1, x, y));
		}
	}
	// left
	tx = Math.round(this.x / Landform.BRICK_WIDTH);
	if (tx < 0) {
		return result;
	}
	for (var ty = 0; ty < this.bh; ty++) {
		var ix = ty * this.bw * 4 + tx * 4;
		var brick = this.brick.data[ix + 1];

		if (Enemy.MAX_TYPE < brick) {
			var y = -this.y + (ty + 1) * Landform.BRICK_WIDTH;

			result.push(Enemy.assign(brick - 1 - Enemy.MAX_TYPE, 0, y));
		}
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

Landform.prototype.scanFloor = function(target) {
	if (!this.brick) {
		return;
	}
	var y = target.y;
	var brick = this.getBrick(target, 2);

	if (0 < brick) {
		y = Math.floor(target.y / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
		while (0 < brick) {
			y -= Landform.BRICK_WIDTH;
			var temp = {x:target.x, y:y};
			brick = this.getBrick(temp, 2);
		}
		y += Landform.BRICK_WIDTH;
	} else {
		y = Math.floor(target.y / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
		while (y < this.height && !brick) {
			y += Landform.BRICK_WIDTH;
			var temp = {x:target.x, y:y};

			brick = this.getBrick(temp, 2);
		}
		if (!brick) {
			// abyss
			y = this.height + target.height + Landform.BRICK_WIDTH;
		}
	}
	return y;
};

Landform.prototype.getHorizontalAngle = function(target) {
	var left = {x:target.x - Landform.BRICK_WIDTH, y:target.y - Landform.BRICK_WIDTH*2};
	var right = {x:target.x + Landform.BRICK_WIDTH, y:target.y - Landform.BRICK_WIDTH*2};
	var leftY = this.scanFloor(left);
	var rightY = this.scanFloor(right);

	return Math.atan2(rightY - leftY, target.width);
};

Landform.prototype.getBrickIndex = function(target) {
	var tx = Math.round((this.x + target.x - Landform.BRICK_HALF) / Landform.BRICK_WIDTH);
	if (tx < 0 || this.bw < tx) {
		return -1;
	}
	var ty = Math.round((this.y + target.y - Landform.BRICK_HALF) / Landform.BRICK_WIDTH);

	ty %= this.bh;
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
Landform.prototype.wheel = function(delta) {
	if (delta < 0){
		this.y += Landform.BRICK_WIDTH;
		if (this.height <= this.y) {
			this.y = 0;
		}
	} else {
		if (this.y == 0) {
			this.y = this.height;
		}
		this.y -= Landform.BRICK_WIDTH;
	}
};

Landform.prototype.putBrick = function(target, c, val) {
	var ix = this.getBrickIndex(target);

	if (ix < 0) {
		return;
	}
	this.brick.data[ix + c] = val;
	this.brick.data[ix + 3] = val ? 255 : 0;
};

Landform.prototype.drawEnemy = function(num, x, y) {
	var reverse = Enemy.MAX_TYPE < num;
	var ix = reverse ? num - Enemy.MAX_TYPE : num;
	var obj = Enemy.LIST[ix - 1];
	var cnt = obj.formation ? 3 : 1;
	var enemy = obj.instance;
	var ctx = this.ctx;

	if (!obj.instance) {
		return null;
	}
	enemy.x = x + enemy.hW;
	enemy.y = y + enemy.hH;
	while (cnt--) {
		enemy.draw(ctx);
		enemy.x += 2;
		enemy.y += 2;
	}
	if (reverse) {
		ctx.save();
		ctx.translate(enemy.x, enemy.y);
		ctx.drawImage(this.reverse, -8, -4);
		ctx.restore();
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
	var selection = parseInt(this.selection);

	if (0 < selection) {
		var enemy = this.drawEnemy(selection, tx, ty);

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
	var selection = parseInt(this.selection);
	if (0 < selection) {
		// enemy
		var brick = this.getBrick(this.target, 1);
		var reverse = brick - Enemy.MAX_TYPE;

		if (!brick || (brick != selection && reverse != selection)) {
			this.putBrick(this.target, 1, selection);
		} else if (brick == selection) {
			this.putBrick(this.target, 1, selection + Enemy.MAX_TYPE);
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
	var sy = Math.round(this.y / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	var startY = sy / Landform.BRICK_WIDTH;
	var bd = this.brick.data;

	ctx.save();
	ctx.fillStyle = 'rgba(' + red + ', ' + green + ', 255, .4)';
	for (var y = 0; y < this.bh; y++) {
		var iy = startY + y;
		var ry = iy * Landform.BRICK_WIDTH;
		var ix = ((iy % this.bh) * this.bw + startX) * 4;

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
	if (this.width - Field.WIDTH <= this.x) {
		var x = this.width - Landform.BRICK_WIDTH;
		ctx.fillStyle = 'rgba(255, 0, 0, .4)';
		ctx.fillRect(x, 0, Landform.BRICK_WIDTH, this.height);
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
	ctx.translate(-this.x, -this.y);
	ctx.drawImage(this.img, 0, 0);
	if (this.viewY < this.y) {
		ctx.drawImage(this.img, 0, this.height);
	}
	this.drawBrick();
	this.drawTarget();
	ctx.restore();
	if (!this.brick || !this.isEdit) {
		return;
	}
	if (this.touch && this.brick) {
		this.updateMap();
		this.touch = false;
	}
};

Landform.prototype.updateMap = function() {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var mapImage = document.getElementById('mapImage');

	canvas.width = this.brick.width;
	canvas.height = this.brick.height;
	ctx.putImageData(this.brick, 0, 0);
	mapImage.setAttribute('src', canvas.toDataURL('image/png'));
};

Landform.prototype.getImageData = function() {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	canvas.width = this.width;
	canvas.height = this.height;
	ctx.drawImage(this.img, 0, 0);
	return ctx.getImageData(0, 0, this.width, this.height);
};

Landform.prototype.getBrickData = function(ctx) {
	if (this.brick != null) {
		return this.brick;
	}
	var bw = this.width / Landform.BRICK_WIDTH;
	var bh = this.height / Landform.BRICK_WIDTH;
	return ctx.createImageData(bw, bh);
};

Landform.prototype.generateBrick = function(ctx) {
	if (!this.img.src || !this.img.complete) {
		return;
	}
	var img = this.getImageData();
	var bw = this.width / Landform.BRICK_WIDTH;
	var bh = this.height / Landform.BRICK_WIDTH;
	var brick = this.getBrickData(ctx);
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
