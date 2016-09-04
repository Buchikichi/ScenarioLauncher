function Stage(scroll, map, bgm) {
	this.scroll = scroll;
	this.map = map;
	this.bgm = bgm;
	this.boss = null;
	this.background = [];
}
Stage.SCROLL = {
	OFF: 0,
	ON: 1,
	LOOP: 2
};
Stage.LIST = [];

Stage.prototype.addBoss = function(boss) {
	this.boss = boss;
	return this;
};

Stage.prototype.bg = function(img) {
	var len = arguments.length;
	var speed = 1 < len ? arguments[1] : 1;
	var dir = 2 < len ? arguments[2] : 0;
	var blink = 3 < len ? arguments[3] : 0;

	this.background.push(new StageBg(img, speed, dir, blink));
	return this;
};

/**
 * Background information.
 * @param img
 */
function StageBg(img, speed, dir, blink) {
	var stageBg = this;

	this.ready = false;
	this.pattern = null;
	this.img = new Image();
	this.img.src = './img/' + img;
	this.img.onload = function() {
		stageBg.ready = true;
	};
	this.speed = speed;
	this.dir = dir;
	this.blink = blink;
	this.reset();
}

StageBg.prototype.reset = function() {
	this.x = 0;
	this.y = 0;
	this.alpha = 1;
	this.blinkDir = -1;
};

StageBg.prototype.forward = function() {
	this.x += Math.cos(this.dir) * this.speed;
	this.y += Math.sin(this.dir) * this.speed;
	if (this.blink) {
		this.alpha += this.blinkDir * this.blink;
		if (this.alpha <= 0.4 || 1.0 <= this.alpha) {
			this.blinkDir *= -1;
		}
	}
};
