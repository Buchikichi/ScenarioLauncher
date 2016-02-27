/**
 * Field.
 */
function Field() {
	this.picX = 10;
	this.picY = 10;
	this.picW = 150;
	this.picH = 150;
	this.actors = [];
	this.init();
	this.resetParams();
}
Field.WIDTH = 320;
Field.HEIGHT = 224;
Field.MIN_Y = 70;
Field.MAX_Y = 200;

Field.prototype.resetParams = function() {
	this.x = 0;
	this.y = this.oy;
	this.z = 0;
	this.fill = 'rgba(164, 247, 164, 1)';
	this.fillV = 'rgba(115, 197, 115, 1)';
	this.fillH = 'rgba(140, 225, 140, .8)';
};

Field.prototype.init = function() {
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.ox = Field.WIDTH / 2;
	this.oy = Field.HEIGHT / 2;
	this.resize(1);
};
Field.prototype.resize = function(magni) {
	var canvas = $(this.canvas);

	this.width = Field.WIDTH * magni;
	this.height = Field.HEIGHT * magni;
	this.cx = this.width / 2;
	this.cy = this.height / 2;
	this.magni = magni;
	canvas.attr('width', this.width);
	canvas.attr('height', this.height);
};
Field.prototype.addActor = function(actor) {
	this.actors.push(actor);
};

Field.prototype.moveH = function(delta) {
	this.x += delta;
	this.x %= 64;
};

Field.prototype.moveV = function(delta) {
	this.y -= delta;
	if (this.y < Field.MIN_Y) {
		this.y = Field.MIN_Y;
	} else if (Field.MAX_Y < this.y) {
		this.y = Field.MAX_Y;
	}
};

Field.prototype.drawGround = function() {
	var ctx = this.ctx;

	ctx.fillStyle = this.fill;
	ctx.fillRect(0, this.y, Field.WIDTH, Field.HEIGHT - this.y);
	ctx.fillStyle = this.fillV;
	for (var cnt = -80; cnt <= 80; cnt += 2) {
		var lx = this.ox / 2 + cnt * 32 + this.x;
		var rx = lx + 32;
		ctx.beginPath();
		ctx.moveTo(this.ox, this.y);
		ctx.lineTo(lx, Field.HEIGHT);
		ctx.lineTo(rx, Field.HEIGHT);
		ctx.closePath();
		ctx.fill();
	}
	var ratio = 1 - this.y / Field.HEIGHT;
	var height = 32 * ratio;

	ctx.fillStyle = this.fillH;
	for (var cnt = 0; cnt < Field.HEIGHT; cnt += 32) {
		var py = cnt + this.z;
		var at = Math.atan2(py, Field.HEIGHT * .6);
		var y = this.y + py * at * ratio;

		ctx.fillRect(0, y, Field.WIDTH, height * at);
	}
	this.z += 6;
	if (32 < this.z) {
		this.z %= 32;
	}
};

Field.prototype.drawActors = function() {
	var ctx = this.ctx;
	var field = this;

	this.actors.forEach(function(actor) {
		actor.move();
		actor.draw(ctx);
		if (actor instanceof Hero) {
			var diffH = field.ox - (actor.x + actor.hW);
			var diffV = field.y - (actor.y + actor.hH);

			field.moveH(diffH / 6);
			field.moveV(diffV / 5);
		}
	});
};

Field.prototype.draw = function() {
	var ctx = this.ctx;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.scale(this.magni, this.magni);
	this.drawGround();
	this.drawActors();
	ctx.restore();
};
