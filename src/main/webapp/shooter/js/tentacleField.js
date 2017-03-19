/**
 * Field.
 */
function Field(width, height) {
	this.width = width;
	this.height = height;
	this.ship = new Ship(57, 137);
	this.actors = [this.ship];
	this.init();

	var tentacle = new Tentacle(250, 60);
	var joint = tentacle.next;

	while (joint) {
		this.actors.push(joint);
		joint = joint.next;
	}
	this.actors.push(tentacle);
}

Field.prototype.init = function() {
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.ox = this.width / 2;
	this.oy = this.height / 2;
	this.resize(1);
	canvas.width = this.width;
	canvas.height = this.height;
	Field.Instance = this;
};

Field.prototype.resize = function(magni) {
	let scaleW = document.body.clientWidth / this.width;
	let scaleH = window.innerHeight / this.height;
	let view = document.getElementById('view');

	this.scale = scaleH < scaleW ? scaleH : scaleW;
	// transform: scale(2);
	view.setAttribute('style', 'transform: scale(' + this.scale + ');');
};

Field.prototype.drawActors = function() {
	this.actors.forEach(actor => {
		actor.move(this.ship);
		actor.draw(this.ctx);
	});
};

Field.prototype.draw = function() {
	var ctx = this.ctx;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	this.drawActors();
	ctx.restore();
};

Field.prototype.calcPan = function(x) {
	return (x - this.hW) / this.hW;
}
