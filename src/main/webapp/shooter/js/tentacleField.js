/**
 * Field.
 */
function Field() {
	this.ship = new Ship(this, 57, 137);
	this.actors = [this.ship];
	this.init();

	var tentacle = new Tentacle(this, 250, 60);
	var joint = tentacle.next;

	while (joint) {
		this.actors.push(joint);
		joint = joint.next;
	}
	this.actors.push(tentacle);
}
Field.WIDTH = 512;
Field.HEIGHT = 224;

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

Field.prototype.inkey = function(keys) {
	this.ship.dir = null;
	this.ship.inkey(keys);
};

Field.prototype.drawActors = function() {
	var ctx = this.ctx;
	var ship = this.ship;

	this.actors.forEach(function(actor) {
		actor.move(ship);
		actor.draw(ctx);
	});
};

Field.prototype.draw = function() {
	var ctx = this.ctx;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.scale(this.magni, this.magni);
	this.drawActors();
	ctx.restore();
};
