class Stage {
	constructor(scroll, map, view) {
		this.scroll = scroll;
		this.scrollSv = scroll;
		this.map = map;
		this.view = view;
		this.fg = null;
		this.bgm = null;
		this.boss = null;
		this.checkPoint = 0;
		this.view.forEach(ground => {
			ground.stage = this;
		});
		this.effectH = 0;
		this.effectV = 0;
	}

	setBgm(bgm, boss = null) {
		this.bgm = bgm;
		this.boss = boss;
		AudioMixer.INSTANCE.reserve([this.bgm, this.boss]);
		return this;
	}

	playBgm() {
		if (this.bgm) {
	//console.log('playBgm:');
			AudioMixer.INSTANCE.play(this.bgm, .7, true);
		}
	}

	getFg() {
		if (this.fg) {
			return this.fg;
		}
		let fg;

		this.view.forEach(ground => {
			if (ground instanceof StageFg) {
				fg = ground;
			}
		});
		this.fg = fg;
		return fg;
	}

	reset() {
		this.checkPoint = Stage.CHECK_POINT[0];
		this.retry();
	}

	retry() {
		this.scroll = this.scrollSv;
		this.effectH = 0;
		this.effectV = 0;
		this.view.forEach(ground => {
			ground.reset(this.checkPoint);
		});
		this.playBgm();
	}

	scrollV(target) {
		this.effectV = 0;
		if (this.scroll == Stage.SCROLL.OFF) {
			return;
		}
		let field = Field.Instance;
		let diff = field.hH - target.y;
		let fg = this.getFg();

		if (this.scroll == Stage.SCROLL.TOP) {
			diff = fg.speed * 5;
		} else if (this.scroll == Stage.SCROLL.BOTTOM) {
			diff = -fg.speed * 5;
		} else if (Math.abs(diff) < fg.speed) {
			return;
		}
		let dy = diff / 3;
		let nextY = fg.y - dy;
		let fgViewY = fg.height - field.height;

		if (this.scroll == Stage.SCROLL.ON) {
			if (nextY < 0 || fgViewY < nextY) {
				return;
			}
		}
	//console.log('Y:' + fg.y);
		if (this.scroll == Stage.SCROLL.TOP && nextY < 0) {
			this.scroll = Stage.SCROLL.OFF;
			return;
		}
		if (this.scroll == Stage.SCROLL.BOTTOM) {
			console.log('nextY:' + nextY + '/' + fg.height);
			if (fgViewY < nextY) {
				this.scroll = Stage.SCROLL.OFF;
				return;
			}
		}
		this.effectV = dy;
	}

	forward(landform) {
		this.view.forEach(ground => {
			ground.forward(landform);
		});
		let fgX = this.getFg().x;

		Stage.CHECK_POINT.forEach(cp => {
			if (cp <= fgX && this.checkPoint < fgX) {
				this.checkPoint = cp;
			}
		});
	}

	drawBg(ctx) {
		this.view.forEach(ground => {
			if (ground instanceof StageFg) {
				return;
			}
			ground.draw(ctx);
		});
	}

	drawFg(ctx) {
		this.view.forEach(ground => {
			if (ground instanceof StageBg) {
				return;
			}
			ground.draw(ctx);
		});
	}

	notice() {
		if (this.scroll != Stage.SCROLL.ON && this.scroll != Stage.SCROLL.LOOP) {
			return;
		}
		let fg = this.getFg();

		if (fg.y < fg.height / 2) {
			this.scroll = Stage.SCROLL.TOP;
		} else {
			this.scroll = Stage.SCROLL.BOTTOM;
		}
	}

	toBossMode() {
		if (this.boss) {
			AudioMixer.INSTANCE.play(this.boss, .7, true);
		}
//		if (this.scroll == Stage.SCROLL.LOOP) {
//			this.scroll = Stage.SCROLL.ON;
//		}
	}
}
Stage.SCROLL = {
	OFF: 0,
	ON: 1,
	LOOP: 2,
	TOP: 4,
	BOTTOM: 8
};
Stage.LIST = [];
Stage.CHECK_POINT = [0, 660, 1440];

/**
 * Foreground and Background.
 */
class StageView {
	constructor(img, speed, dir, blink) {
		this.ready = false;
		this.pattern = null;
		this.repeatX = 2;
		this.img = new Image();
		this.img.onload = ()=> {
			this.width = this.img.width;
			this.height = this.img.height;
			this.w2 = this.img.width * this.repeatX;
			this.h2 = this.img.height * 2;
			this.ready = true;
		};
		this.img.src = './img/' + img;
		this.speed = speed;
		this.dir = dir;
		this.blink = blink;
		this.reset();
	}

	reset(checkPoint) {
		this.x = checkPoint % this.width;
		this.y = 0;
		this.effectH = 0;
		this.effectV = 0;
		this.alpha = 1;
		this.blinkDir = -1;
	}

	forward() {
		let effectV = this.stage.effectV;

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
	}

	getPattern(ctx, img) {
		if (!this.pattern && this.ready) {
			this.pattern = ctx.createPattern(img, 'repeat');
		}
		return this.pattern;
	}

	draw(ctx) {
		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.translate(-this.x, -this.y);
		ctx.beginPath();
		ctx.fillStyle = this.getPattern(ctx, this.img);
		ctx.rect(0, 0, this.w2, this.h2);
		ctx.fill();
		ctx.restore();
	}
}

/**
 * Foreground information.
 */
class StageFg extends StageView {
	constructor(img, speed = .5, dir = 0, blink = 0) {
		super(img, speed, dir, blink);
		this.repeatX = 1;
		this.bmp = this.img;
	}

	createCanvas() {
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');

		canvas.width = this.width;
		canvas.height = this.height;
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.drawImage(this.img, 0, 0);
		return canvas;
	}

	reset(checkPoint) {
		let fg = this;

		super.reset(checkPoint);
		if (checkPoint == 0) {
			this.x = -Field.Instance.width;
		}
		if (this.ready) {
			this.canvas = this.createCanvas();

			this.pattern = canvas.getContext('2d').createPattern(this.canvas, 'repeat');
		}
	}

	smashWall(target) {
		let tx = Math.round((this.x + target.x - Landform.BRICK_HALF) / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
		let ty = Math.round((this.y + target.y - Landform.BRICK_HALF) / Landform.BRICK_WIDTH) * Landform.BRICK_WIDTH;
		let ctx = this.canvas.getContext('2d');

		ty %= this.height;
		ctx.clearRect(tx, ty, Landform.BRICK_WIDTH, Landform.BRICK_WIDTH);
		this.pattern = ctx.createPattern(this.canvas, 'repeat');
	}
}

/**
 * Background information.
 */
class StageBg extends StageView {
	constructor(img, speed = .5, dir = 0, blink = 0) {
		super(img, speed, dir, blink);
	}
}
