function Stage(scroll, map, view) {
	var stage = this;

	this.scroll = scroll;
	this.map = map;
	this.view = view;
	this.fg = null;
	this.bgm = null;
	this.boss = null;
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

Stage.prototype.reset = function(ctx) {
	this.effectH = 0;
	this.effectV = 0;
	this.view.forEach(function(ground) {
		if (!ground.pattern) {
			ground.pattern = ctx.createPattern(ground.img, 'repeat');
		}
		ground.reset();
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
	this.img = new Image();
	this.img.src = './img/' + img;
	this.img.onload = function() {
		stageView.width = this.width;
		stageView.height = this.height;
		stageView.w2 = this.width * 2;
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

StageView.prototype.reset = function() {
	this.x = 0;
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

StageView.prototype.draw = function(ctx) {
	ctx.save();
	ctx.globalAlpha = this.alpha;
	ctx.translate(-this.x, -this.y);
	ctx.beginPath();
	ctx.fillStyle = this.pattern;
	ctx.rect(0, 0, this.w2, this.h2);
	ctx.fill();
	ctx.restore();
};

/**
 * Foreground information.
 */
function StageFg() {
	StageView.apply(this, arguments);
}
StageFg.prototype = Object.create(StageView.prototype);

StageFg.prototype._reset = StageView.prototype.reset;
StageFg.prototype.reset = function() {
	this._reset();
	this.x = -Field.WIDTH;
};

/**
 * Background information.
 */
function StageBg() {
	StageView.apply(this, arguments);
}
StageBg.prototype = Object.create(StageView.prototype);
