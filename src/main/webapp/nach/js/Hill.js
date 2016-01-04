/**
 * Hill.
 */
function Hill(field) {
	this.field = field;
	this.x = 0;
	this.y = field.height;
	this.dy = 0;
	this.cnt = 0;
	this.waveList = [];
	this.setup();
}
Hill.prototype.STEP = 16;
Hill.prototype.MAX_DY = 10; // 高低差
Hill.prototype.MAX_CNT = 8;

Hill.prototype.setup = function() {
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.maxX = this.field.width;
	this.minY = this.field.height * .5;
	this.maxY = this.field.height;

	this.waveList.push(new WaveInfo(this.y, {y:this.y}));
	for (var ix = 0; ix <= this.maxX; ix += this.STEP) {
		this.forward();
	}
};

Hill.prototype.calcHeight = function(target, ctx) {
	var left = target.x + target.hW;
	var ix = parseInt((left + this.x - this.STEP / 2) / this.STEP) + 1;
	var wave = this.waveList[ix];
	var height = wave.y;
	var x = ix * this.STEP - this.x;
	var bx = x - this.STEP / 2;
	var nx = x + this.STEP / 2;
	var y = wave.y;
	var by = (wave.by + y) / 2;
	var ny = (wave.ny + y) / 2;
	var bdx = x - bx;
	var bdy = y - by;
	var edx = nx - x;
	var edy = ny - y;
	var diffMin = nx - bx;
	var svSX = x;
	var svSY = y;
	var svEX = x;
	var svEY = y;

	//console.log('bx:' + bx);
	//console.log('x:' + x + '/y:' + y);
	if (ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.moveTo(bx, by);
		ctx.quadraticCurveTo(x, y, nx, ny);
		ctx.strokeStyle = 'rgba(0, 128, 255, 0.9)';
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(255, 255, 128, 0.9)';
		ctx.moveTo(bx, by);
	}
	for (var t = 0; t < 1; t += .01) {
		var sx = bx + bdx * t;
		var sy = by + bdy * t;
		var ex = x + edx * t;
		var ey = y + edy * t;
		var px = sx + (ex - sx) * t;
		var py = sy + (ey - sy) * t;
		var diff = Math.abs(px - left);

		if (diff < diffMin) {
			svSX = sx;
			svSY = sy;
			svEX = ex;
			svEY = ey;
			height = py;
			diffMin = diff;
		}
		if (ctx) {
			ctx.lineTo(px, py);
		}
	}
	if (ctx) {
		ctx.stroke();
		// Point
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.arc(left, height, 2, 0, Math.PI * 2, false);
		ctx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
		ctx.stroke();

		ctx.restore();
	}
	return {h:height, rad:Math.atan2(svEY - svSY, svEX - svSX)};
};

Hill.prototype.forward = function() {
	if (0 < this.cnt) {
		this.cnt--;
	} else {
		this.cnt = parseInt(Math.random() * this.MAX_CNT);
		this.dy = parseInt(Math.random() * this.MAX_DY * 2) - this.MAX_DY;
	}
	this.svY = this.y;
	this.y += this.dy;
	if (this.y < this.minY || this.maxY < this.y) {
		this.y = this.svY;
		this.cnt = 0;
	}
	var bw = this.waveList[this.waveList.length - 1];

	this.waveList.push(new WaveInfo(this.y, bw));
};

/**
 * Move.
 */
Hill.prototype.move = function(step) {
	this.x += step;
	while (this.STEP < this.x) {
		this.forward();
		this.waveList.shift();
		this.x -= this.STEP;
	}
};

Hill.prototype.drawDebugBar = function(ctx) {
	var hill = this;
	var left = 0;

	ctx.beginPath();
	ctx.fillStyle = 'rgba(128, 128, 255, 0.8)';
	ctx.strokeStyle = 'rgba(0, 128, 255, 0.1)';
	this.waveList.forEach(function(wave) {
		var top = wave.y;
		var h = hill.maxY - top;

		ctx.rect(left - hill.x, top, 5, h);
		ctx.stroke();
		ctx.fill();
		left += hill.STEP;
	});
};

/**
 * Draw.
 * @param ctx
 */
Hill.prototype.draw = function(ctx) {
	var firstWave = this.waveList[0];

//	this.drawDebugBar(ctx);
	ctx.beginPath();
	ctx.fillStyle = 'rgb(118, 90, 70)';
	ctx.lineWidth = 1;
	ctx.moveTo(0, this.maxY);
	ctx.lineTo(0, firstWave.y);
	for (var ix = 0; ix < this.waveList.length; ix += 1) {
		var wave = this.waveList[ix];
		var x = ix * this.STEP - this.x;
		var nx = (ix + 1) * this.STEP - this.x;
		var y = wave.y;
		var ny = wave.ny;

		ctx.quadraticCurveTo(x, y, (nx + x) / 2, (ny + y) / 2);
	}
	ctx.lineTo(this.maxX, this.maxY);
	ctx.lineTo(0, this.maxY);
//	ctx.closePath();
	ctx.stroke();
	ctx.fill();
};

//-----------------------------------------------------------------------------
function WaveInfo(y, bw) {
	this.y = y;
	this.by = bw.y;
	this.ny = this.y
	bw.ny = this.y;
}
