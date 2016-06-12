function Player(x, y, imgsrc) {
	Chain.apply(this, arguments);
	var player = this;

	this.dx = 0;
	this.dy = 0;
	this.width = 16;
	this.height = 16;
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.speed = 2;
	this.img = new Image();
	this.img.onload = function() {
		player.width = this.width;
		player.height = this.height;
		player.hW = this.width / 2;
		player.hH = this.height / 2;
	};
	this.img.src = imgsrc;
}
Player.prototype = Object.create(Chain.prototype);

Player.prototype.move = function() {
	this.svX = this.x;
	this.svY = this.y;
	this.x += this.dx * this.speed;
	this.y += this.dy * this.speed;
};

Player.prototype.draw = function(ctx) {
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.drawImage(this.img, -this.hW, -this.hH);
	ctx.restore();
};

function Lib(x, y, imgsrc) {
	Player.apply(this, arguments);
	this.id = 'L';
}
Lib.prototype = Object.create(Player.prototype);

function Rab(x, y, imgsrc) {
	Player.apply(this, arguments);
	this.id = 'R';
}
Rab.prototype = Object.create(Player.prototype);
