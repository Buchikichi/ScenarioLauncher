/**
 * Landform.
 */
class Landform {
	constructor(canvas, isEdit = false) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.isEdit = isEdit;
		this.effectH = 0;
		this.next = Landform.NEXT.NONE;
		this.col = 0;
		this.colDir = 1;
		this.magni = 1;
		this.target = null;
		this.tx = 0;
		this.ty = 0;
		this.selection = 'b0';
		this.which = null;
		this.brick = null;
		this.brickVal = null;
		this.lastScan = null;
		this.touch = false;
		this.img = new Image();
		this.img.onload = ()=> {
			let field = Field.Instance;

			this.width = this.img.width;
			this.height = this.img.height;
			this.bw = this.img.width / Landform.BRICK_WIDTH;
			this.bh = this.img.height / Landform.BRICK_WIDTH;
			if (field) {
				this.viewX = this.img.width - (field.hW * 1.5);
				this.arrivX = this.img.width - field.width;
				this.noticeX = this.arrivX - field.hW;
			}
		}
		this.reverse = new Image();
		this.reverse.src = './img/reverse.png';
		this.touch = false;
	}
}
Landform.BRICK_WIDTH = 8;
Landform.BRICK_HALF = Landform.BRICK_WIDTH / 2;
Landform.BRICK_TYPE = {
	WALL: 255,
	BRITTLE: 254,
};
Landform.COL_MAX = 512;
Landform.NEXT = {
	NONE: 0,
	NOTICE: 1,
	ARRIV: 2,
	IDLE: 3,
	PAST: 4
};

Landform.prototype.load = function(file) {
	if (file instanceof File) {
		this.img.src = window.URL.createObjectURL(file);
	}
};

Landform.prototype.loadMapData = function(file) {
	let landform = this;
	let img = new Image();

	img.onload = function() {
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');

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
	let fg = stage.getFg();

	this.stage = stage;
	this.loadMapData('./img/' + stage.map);
	this.img.src = fg.img.src;
	this.reset();
};

/*
 * for play.
 */
Landform.prototype.reset = function() {
	this.next = Landform.NEXT.NONE;
	if (this.stage) {
		this.stage.reset();
	}
};

Landform.prototype.retry = function() {
	this.next = Landform.NEXT.NONE;
	if (this.stage) {
		this.stage.retry();
		this.loadMapData('./img/' + this.stage.map);
	}
};

Landform.prototype.effect = function(target) {
	let maxX = Math.max(Field.Instance.width + target.width, target.maxX);

	if (target.effectH) {
		target.x -= this.effectH;
	}
	if (target.effectV && this.next == Landform.NEXT.NONE) {
		let speed = this.stage.getFg().speed;

		target.y += this.stage.effectV * speed;
	}
	if (target.x < target.minX || maxX < target.x) {
		target.eject();
	}
	if (this.stage.scroll == Stage.SCROLL.OFF) {
		if (target.y < target.minY || target.maxY < target.y) {
			target.eject();
		}
		return;
	}
	if (this.stage.scroll == Stage.SCROLL.ON) {
		if (target.y < -this.height || this.height + target.maxY < target.y) {
			target.eject();
		}
		return;
	}
	// Stage.SCROLL.LOOP
	if (target.gravity) {
		let dy = Math.abs(target.dy * target.speed);

		if (Landform.BRICK_WIDTH + Landform.BRICK_HALF < dy) {
//console.log('dy:' + dy);
			target.eject();
			return;
		}
	}
	if (target.y < 0) {
		target.y += this.height;
	} else if (this.height < target.y) {
		target.y -= this.height;
	}
};

Landform.prototype.forward = function(target) {
	if (!this.width) {
		return Landform.NEXT.NONE;
	}
	let fg = this.stage.getFg();

	if (this.next != Landform.NEXT.ARRIV) {
		this.stage.scrollV(target);
	}
	if (this.viewX <= fg.x) {
		this.effectH = 0;
		if (this.next != Landform.NEXT.PAST) {
			this.next = Landform.NEXT.PAST;
			return Landform.NEXT.PAST;
		}
		return Landform.NEXT.NONE;
	}
	this.stage.forward();
	this.effectH = fg.effectH;
	if (this.arrivX <= fg.x) {
		if (this.next == Landform.NEXT.NOTICE) {
			fg.x = this.arrivX;
			this.effectH = 0;
			this.next = Landform.NEXT.ARRIV;
			return Landform.NEXT.ARRIV;
		}
		if (this.arrivX < fg.x) {
			this.next = Landform.NEXT.IDLE;
			return Landform.NEXT.IDLE;
		}
	} else if (this.noticeX <= fg.x) {
		if (this.next != Landform.NEXT.NOTICE) {
			this.next = Landform.NEXT.NOTICE;
			return Landform.NEXT.NOTICE;
		}
	}
	return Landform.NEXT.NONE;
};

Landform.prototype.scanEnemy = function() {
	let result = [];

	if (!this.brick || this.next == Landform.NEXT.IDLE) {
		return result;
	}
	let field = Field.Instance;
	let fg = this.stage.getFg();
	let gx = fg.x;
	let gy = fg.y;
	// right
	let tx = Math.round((gx + field.width - Landform.BRICK_HALF) / Landform.BRICK_WIDTH);

	if (tx < 0) {
		return result;
	}
	if (tx === this.lastScan) {
		return result;
	}
	this.lastScan = tx;
	let x = field.width + Landform.BRICK_WIDTH;
	for (let ty = 0; ty < this.bh; ty++) {
		let ix = ty * this.bw * 4 + tx * 4;
		let brick = this.brick.data[ix + 1];

		if (0 < brick && brick <= Enemy.MAX_TYPE) {
			let y = -gy + (ty + 1) * Landform.BRICK_WIDTH;

			result.push(Enemy.assign(brick - 1, x, y));
		}
	}
	// left
	tx = Math.round(gx / Landform.BRICK_WIDTH);
	if (tx < 0) {
		return result;
	}
	for (let ty = 0; ty < this.bh; ty++) {
		let ix = ty * this.bw * 4 + tx * 4;
		let brick = this.brick.data[ix + 1];

		if (Enemy.MAX_TYPE < brick) {
			let y = -gy + (ty + 1) * Landform.BRICK_WIDTH;

			result.push(Enemy.assign(brick - 1 - Enemy.MAX_TYPE, 0, y));
		}
	}
	return result;
};

Landform.prototype.hitTest = function(target) {
	if (!this.brick) {
		return;
	}
	target.walled = this.getBrick(target, 2);
	this.target = target;
};

Landform.prototype.smashWall = function(target) {
	let fg = this.stage.getFg();

	fg.smashWall(target);
	this.putBrick(target, 2, 0);
};

Landform.prototype.scanFloor = function(target) {
	if (!this.brick) {
		return;
	}
	let y = target.y;
	let brick = this.getBrick(target, 2);
	let sign = target.gravity < 0 ? -1 : 1;

	if (0 < brick) {
		y = Math.floor(target.y / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
		while (0 < brick) {
			y -= Landform.BRICK_WIDTH * sign;
			let temp = {x:target.x, y:y};
			brick = this.getBrick(temp, 2);
		}
		y += Landform.BRICK_WIDTH * sign;
	} else {
		y = Math.floor(target.y / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
		if (sign < 0) {
			// top
			while (0 < y && !brick) {
				y -= Landform.BRICK_WIDTH;
				let temp = {x:target.x, y:y};

				brick = this.getBrick(temp, 2);
			}
			if (!brick) {
				// abyss
				y = -target.height - Landform.BRICK_WIDTH;
			}
		} else {
			// bottom
			while (y < this.height && !brick) {
				y += Landform.BRICK_WIDTH;
				let temp = {x:target.x, y:y};

				brick = this.getBrick(temp, 2);
			}
			if (!brick) {
				// abyss
				y = this.height + target.height + Landform.BRICK_WIDTH;
			}
		}
	}
	return y;
};

Landform.prototype.getHorizontalAngle = function(target) {
	let left = {x:target.x - Landform.BRICK_WIDTH, y:target.y - Landform.BRICK_WIDTH*2};
	let right = {x:target.x + Landform.BRICK_WIDTH, y:target.y - Landform.BRICK_WIDTH*2};
	let leftY = this.scanFloor(left);
	let rightY = this.scanFloor(right);

	return Math.atan2(rightY - leftY, target.width);
};

Landform.prototype.getBrickIndex = function(target) {
	let fg = this.stage.getFg();
	let gx = fg.x;
	let gy = fg.y;
	let tx = Math.round((gx + target.x - Landform.BRICK_HALF) / Landform.BRICK_WIDTH);
	if (tx < 0 || this.bw < tx) {
		return -1;
	}
	let ty = Math.round((gy + target.y - Landform.BRICK_HALF) / Landform.BRICK_WIDTH);
	ty %= this.bh;
	return ty * this.bw * 4 + tx * 4;
};

Landform.prototype.getBrick = function(target, c) {
	if (!this.brick) {
		return null;
	}
	let ix = this.getBrickIndex(target);

	if (ix < 0) {
		return null;
	}
	return this.brick.data[ix + c];
};

/*
 * for edit
 */
Landform.prototype.wheel = function(delta) {
	let fg = this.stage.getFg();

	if (delta < 0){
		fg.y += Landform.BRICK_WIDTH * 2;
		if (this.height <= fg.y) {
			fg.y = 0;
		}
	} else {
		if (fg.y == 0) {
			fg.y = this.height;
		}
		fg.y -= Landform.BRICK_WIDTH * 2;
	}
};

Landform.prototype.putBrick = function(target, c, val) {
	let ix = this.getBrickIndex(target);

	if (ix < 0) {
		return;
	}
	this.brick.data[ix + c] = val;
	this.brick.data[ix + 3] = val ? 255 : 0;
};

Landform.prototype.drawEnemy = function(num, x, y) {
	let reverse = Enemy.MAX_TYPE < num;
	let ix = reverse ? num - Enemy.MAX_TYPE : num;
	let obj = Enemy.LIST[ix - 1];
	let cnt = obj.formation ? 3 : 1;
	let enemy = obj.instance;
	let ctx = this.ctx;

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
	let tx = Math.round((this.target.x - Landform.BRICK_HALF) / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	let ty = Math.round((this.target.y - Landform.BRICK_HALF) / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	let ctx = this.ctx;
	let bw = Landform.BRICK_WIDTH;
	let selection = parseInt(this.selection);

	if (0 < selection) {
		let enemy = this.drawEnemy(selection, tx, ty);

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
	let selection = parseInt(this.selection);
	if (0 < selection) {
		// enemy
		let brick = this.getBrick(this.target, 1);
		let reverse = brick - Enemy.MAX_TYPE;

		if (!brick || (brick != selection && reverse != selection)) {
			this.putBrick(this.target, 1, selection);
		} else if (brick == selection) {
			this.putBrick(this.target, 1, selection + Enemy.MAX_TYPE);
		} else {
			this.putBrick(this.target, 1, 0);
		}
	} else {
		let brick = this.getBrick(this.target, 2);

		selection = this.selection.substr(1);
		if (this.brickVal == null) {
			this.brickVal = 0 < brick ? 0 : 255 - selection;
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
	let field = Field.Instance;
	let fg = this.stage.getFg();
	let gx = fg.x;
	let gy = fg.y;
	let ctx = this.ctx;
	let red = 255 < this.col ? this.col - 256 : 0;
	let green = 255 < this.col ? 255 : this.col % 256;
	let brickWidth = Landform.BRICK_WIDTH - 2;
	let sx = Math.round(gx / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	let startX = sx / Landform.BRICK_WIDTH;
	let endX = Math.min(startX + 512 / Landform.BRICK_WIDTH, this.bw);
	let sy = Math.round(gy / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	let startY = sy / Landform.BRICK_WIDTH;
	let bd = this.brick.data;

	ctx.save();
	ctx.translate(-gx, -gy);
	ctx.strokeStyle = 'rgba(' + red + ', ' + green + ', 255, .4)';
	ctx.fillStyle = ctx.strokeStyle;
	for (let y = 0; y < this.bh; y++) {
		let iy = startY + y;
		let ry = iy * Landform.BRICK_WIDTH;
		let ix = ((iy % this.bh) * this.bw + startX) * 4;

		for (let x = startX, rx = sx; x < endX; x++, rx += Landform.BRICK_WIDTH, ix += 4) {
			if (x < 0) {
				continue;
			}
			let enemyNum = bd[ix + 1];
			if (enemyNum) {
				this.drawEnemy(enemyNum, rx, ry);
			}
			let brickNum = bd[ix + 2];
			if (brickNum == 255) {
				ctx.fillRect(rx, ry, brickWidth, brickWidth);
			} else if (brickNum == 254) {
				let ax = rx + Landform.BRICK_HALF - 1;
				let ay = ry + Landform.BRICK_HALF - 1;

				ctx.beginPath();
				ctx.arc(ax, ay, brickWidth / 2, 0, Math.PI2, false);
				ctx.stroke();
				ctx.strokeRect(rx, ry, brickWidth, brickWidth);
			}
		}
	}
	if (this.width - field.width <= gx) {
		let x = this.width - Landform.BRICK_WIDTH;
		ctx.fillStyle = 'rgba(255, 0, 0, .4)';
		ctx.fillRect(x, 0, Landform.BRICK_WIDTH, this.height);
	}
	ctx.restore();
	this.col += this.colDir * 16;
	if (this.col <= 0 || Landform.COL_MAX <= this.col) {
		this.colDir *= -1;
	}
};

Landform.prototype.drawBg = function(ctx) {
	if (!this.stage) {
		return;
	}
	ctx.save();
	ctx.scale(this.magni, this.magni);
	this.stage.drawBg(ctx);
	ctx.restore();
};

Landform.prototype.draw = function() {
	if (!this.stage) {
		return;
	}
	let landform = this;
	let ctx = this.ctx;

	ctx.save();
	ctx.scale(this.magni, this.magni);
	this.stage.drawFg(ctx);
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
	let mapImage = document.getElementById('mapImage');

	if (mapImage) {
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');

		canvas.width = this.brick.width;
		canvas.height = this.brick.height;
		ctx.putImageData(this.brick, 0, 0);
		mapImage.setAttribute('src', canvas.toDataURL('image/png'));
	}
};

Landform.prototype.getImageData = function() {
	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');

	canvas.width = this.width;
	canvas.height = this.height;
	ctx.drawImage(this.img, 0, 0);
	return ctx.getImageData(0, 0, this.width, this.height);
};

Landform.prototype.getBrickData = function(ctx) {
	if (this.brick != null) {
		return this.brick;
	}
	let bw = this.width / Landform.BRICK_WIDTH;
	let bh = this.height / Landform.BRICK_WIDTH;
	return ctx.createImageData(bw, bh);
};

Landform.prototype.generateBrick = function(ctx) {
	if (!this.img.src || !this.img.complete) {
		return;
	}
	let img = this.getImageData();
	let bw = this.width / Landform.BRICK_WIDTH;
	let bh = this.height / Landform.BRICK_WIDTH;
	let brick = this.getBrickData(ctx);
	let dst = brick.data;
	let sx = this.width * Landform.BRICK_HALF + Landform.BRICK_HALF * 4;
	let ix = 0;

console.log(this.width + ' x ' + this.height + ' | ' + (this.width * this.height * 4));
console.log(bw + ' x ' + bh + ' | ' + dst.length);
	for (let y = 0; y < bh; y++) {
		for (let x = 0; x < bw; x++) {
			let dot = false;

			for (let c = 0; c < 4; c++) {
				if (img.data[sx + c]) {
					dot = true;
				}
			}
			let val = dot ? 255 : 0;
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
