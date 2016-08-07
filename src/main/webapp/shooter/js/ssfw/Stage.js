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

	this.background.push(new StageBg(img, speed));
	return this;
};

/**
 * Background information.
 * @param img
 */
function StageBg(img) {
	var len = arguments.length;
	var speed = 1 < len ? arguments[1] : 1;

	this.img = img;
	this.speed = speed;
}
