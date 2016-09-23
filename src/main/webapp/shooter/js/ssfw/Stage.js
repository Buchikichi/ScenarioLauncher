function Stage(scroll, map, view) {
	var stage = this;

	this.scroll = scroll;
	this.map = map;
	this.view = view;
	this.fg = null;
	this.bgm = null;
	this.boss = null;
	this.checkPoint = 0;
	view.forEach(function(ground) {
		ground.stage = stage;
	});
	this.effectH = 0;
	this.effectV = 0;
}
Stage.SCROLL = {
	OFF: 0,
	ON: 1,
	LOOP: 2
};
Stage.LIST = [];
Stage.CHECK_POINT = [660, 1440];

Stage.prototype.setBgm = function(bgm) {
	var len = arguments.length;

	this.bgm = bgm;
	this.boss = 1 < len ? arguments[1] : null;
	return this;
};

Stage.prototype.playBgm = function() {
	if (this.bgm) {
		AudioMixer.INSTANCE.play(this.bgm, .7, true);
	}
};

Stage.prototype.getFg = function() {
	if (this.fg) {
		return this.fg;
	}
	var fg;

	this.view.forEach(function(ground) {
		if (ground instanceof StageFg) {
			fg = ground;
		}
	});
	this.fg = fg;
	return fg;
};

Stage.prototype.reset = function() {
	this.checkPoint = 0;
	this.retry();
};

Stage.prototype.retry = function() {
	var stage = this;

	this.effectH = 0;
	this.effectV = 0;
	this.view.forEach(function(ground) {
		ground.reset(stage.checkPoint);
	});
};

Stage.prototype.scrollV = function(target) {
	this.effectV = 0;
	if (this.scroll == Stage.SCROLL.OFF) {
		return;
	}
	var field = target.field;
	var diff = field.hH - target.y;
	var fg = this.getFg();

	if (Math.abs(diff) < fg.speed) {
		return;
	}
	var dy = diff / 3;

	if (this.scroll == Stage.SCROLL.ON) {
		var nextY = fg.y - dy;

		if (nextY < 0 || fg.viewY < nextY) {
			return;
		}
	}
	this.effectV = dy;
};

Stage.prototype.forward = function(landform) {
	this.view.forEach(function(ground) {
		ground.forward(landform);
	});
	var stage = this;
	var fgX = this.getFg().x;

	Stage.CHECK_POINT.forEach(function(cp) {
		if (cp <= fgX && stage.checkPoint < fgX) {
			stage.checkPoint = cp;
		}
	});
};

Stage.prototype.drawBg = function(ctx) {
	this.view.forEach(function(ground) {
		if (ground instanceof StageFg) {
			return;
		}
		ground.draw(ctx);
	});
};

Stage.prototype.drawFg = function(ctx) {
	this.view.forEach(function(ground) {
		if (ground instanceof StageBg) {
			return;
		}
		ground.draw(ctx);
	});
};

/**
 * Foreground and Background.
 */
function StageView(img) {
	var stageView = this;
	var len = arguments.length;

	this.ready = false;
	this.pattern = null;
	this.repeatX = 2;
	this.img = new Image();
	this.img.src = './img/' + img;
	this.img.onload = function() {
		stageView.width = this.width;
		stageView.height = this.height;
		stageView.w2 = this.width * stageView.repeatX;
		stageView.h2 = this.height * 2;
		stageView.viewX = this.width - Field.HALF_WIDTH;
		stageView.viewY = this.height - Field.HEIGHT;
		stageView.ready = true;
	};
	this.speed = 1 < len ? arguments[1] : 1;
	this.dir = 2 < len ? arguments[2] : 0;
	this.blink = 3 < len ? arguments[3] : 0;
	this.reset();
}

StageView.prototype.reset = function(checkPoint) {
	this.x = checkPoint % this.width;
	this.y = 0;
	this.effectH = 0;
	this.effectV = 0;
	this.alpha = 1;
	this.blinkDir = -1;
};

StageView.prototype.forward = function() {
	var effectV = this.stage.effectV;

	this.effectH = Math.cos(this.dir) * this.speed;
	this.effectV = Math.sin(this.dir) * this.speed;
	this.x += this.effectH;
	this.y += this.effectV;
	this.y -= effectV * this.speed;
	if (this.width < this.x) {
		this.x -= this.width;
	}
	if (this.y < 0) {
		this.y += this.height;
	}
	if (this.height < this.y) {
		this.y -= this.height;
	}
	if (this.blink) {
		this.alpha += this.blinkDir * this.blink;
		if (this.alpha <= 0.3 || 1.0 <= this.alpha) {
			this.blinkDir *= -1;
		}
	}
};

StageView.prototype.getPattern = function(ctx, img) {
	if (!this.pattern && this.ready) {
		this.pattern = ctx.createPattern(img, 'repeat');
	}
	return this.pattern;
};

StageView.prototype.draw = function(ctx) {
	ctx.save();
	ctx.globalAlpha = this.alpha;
	ctx.translate(-this.x, -this.y);
	ctx.beginPath();
	ctx.fillStyle = this.getPattern(ctx, this.img);
	ctx.rect(0, 0, this.w2, this.h2);
	ctx.fill();
	ctx.restore();
};

/**
 * Foreground information.
 */
function StageFg() {
	StageView.apply(this, arguments);
	this.repeatX = 1;
	this.bmp = this.img;
}
StageFg.prototype = Object.create(StageView.prototype);

StageFg.prototype.createCanvas = function() {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	canvas.width = this.width;
	canvas.height = this.height;
	ctx.clearRect(0, 0, this.width, this.height);
	ctx.drawImage(this.img, 0, 0);
	return canvas;
};

StageFg.prototype._reset = StageView.prototype.reset;
StageFg.prototype.reset = function(checkPoint) {
	var fg = this;

	this._reset(checkPoint);
	if (checkPoint == 0) {
		this.x = -Field.WIDTH;
	}
	if (this.ready) {
		this.canvas = this.createCanvas();

		this.pattern = canvas.getContext('2d').createPattern(this.canvas, 'repeat');
	}
};

StageFg.prototype.smashWall = function(target) {
	var tx = Math.round((this.x + target.x - Landform.BRICK_HALF) / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	var ty = Math.round((this.y + target.y - Landform.BRICK_HALF) / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
	var ctx = this.canvas.getContext('2d');

	ty %= this.height;
	ctx.clearRect(tx, ty, Landform.BRICK_WIDTH, Landform.BRICK_WIDTH);
	this.pattern = ctx.createPattern(this.canvas, 'repeat');
};

/**
 * Background information.
 */
function StageBg() {
	StageView.apply(this, arguments);
}
StageBg.prototype = Object.create(StageView.prototype);
