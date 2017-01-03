/**
 * Ship.
 */
function Ship(field, x, y) {
	Actor.apply(this, arguments);
	this.speed = 4;
	this.effectH = false;
	this.shotList = [];
	this.chamberList = [
		new Chamber(Shot, 2, Ship.MAX_SHOTS),
		new Chamber(Missile, 8, 2, {gravity:.1, dir:0}), new Chamber(Missile, 8, 2, {gravity:-.1, dir:0}),
		new Chamber(Missile, 8, 2, {gravity:.1, dir:Math.PI}), new Chamber(Missile, 8, 2, {gravity:-.1, dir:Math.PI}),
	];
	this.anim = new Animator(this, 'ship001.png', Animator.TYPE.V, 1, Ship.PATTERNS * 2 + 1);
	this.reset();
}
Ship.MAX_SHOTS = 7;
Ship.PATTERNS = 2;
Ship.prototype = Object.create(Actor.prototype);

Ship.prototype._recalculation = Actor.prototype.recalculation;
Ship.prototype.recalculation = function() {
	this.right = this.field.width - this.width * 3;
	this.bottom = this.field.height - this.hH;
	this._recalculation();
};

Ship.prototype.reset = function() {
	this.trigger = false;
	this.chamberList.forEach(function(chamber) {
		chamber.reset();
	});
	this.shotList = [];
};

Ship.prototype.inkey = function(keys) {
	var hit = false;
	var dir = 0;

	if (keys['ArrowLeft'] || keys['Left']) {
		dir = 1;
		hit = true;
	} else if (keys['ArrowRight'] || keys['Right']) {
		dir = -1;
		hit = true;
	}
	if (keys['ArrowUp'] || keys['Up']) {
		dir = 2 - dir * .5;
		hit = true;
	} else if (keys['ArrowDown'] || keys['Down']) {
		dir *= .5;
		hit = true;
	}
	if (hit) {
		this.dir = (dir + 1) * Math.SQ;
	}
};

Ship.prototype.sieveShots = function() {
	var shotList = [];

	this.shotList.forEach(function(shot) {
		if (shot.isGone) {
			return;
		}
		shotList.push(shot);
	});
	this.shotList = shotList;
};

Ship.prototype._move = Actor.prototype.move;
Ship.prototype.move = function() {
	this._move();
	this.chamberList.forEach(function(chamber) {
		chamber.probe();
	});
	if (this.isGone) {
		return;
	}
	if (this.walled) {
		this.fate();
		return;
	}
	if (this.x < this.hW || this.right < this.x) {
		this.x = this.svX;
	}
	if (this.y < this.hH || this.bottom < this.y) {
		this.y = this.svY;
	}
	var ship = this;

	// shot & missile
	this.sieveShots();
	if (this.trigger) {
		var result = [];

		this.trigger = false;
		this.chamberList.forEach(function(chamber) {
			var shot = chamber.fire(ship);

			if (shot) {
				ship.shotList.push(shot);
				result.push(shot);
			}
		});
		return result;
	}
};
