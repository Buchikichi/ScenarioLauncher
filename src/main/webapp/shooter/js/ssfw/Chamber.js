/**
 * Chamber.
 */
function Chamber(type, cycle, max, opt) {
	this.type = type;
	this.cycle = cycle;
	this.max = max;
	this.opt = opt;
	this.reset();
}

Chamber.prototype.reset = function() {
	this.tick = 0;
	this.hands = [];
};

Chamber.prototype.probe = function() {
	var validList = [];

	this.hands.forEach(function(elem) {
		if (!elem.isGone) {
			validList.push(elem);
		}
	});
	this.hands = validList;
	this.tick++;
};

Chamber.prototype.fire = function(actor) {
	//var shot = new Shot(this.field, this.x + this.hW, this.y);
	if (this.tick < this.cycle || this.max <= this.hands.length) {
		return null;
	}
	if (this.opt) {
//		this.opt.dir = actor.dir ? actor.dir : 0;
	}
	var field = actor.field;
	var x = actor.x;
	var y = actor.y;
	var elem = new this.type(field, x, y, this.opt);

	this.tick = 0;
	this.hands.push(elem);
	return elem;
};
