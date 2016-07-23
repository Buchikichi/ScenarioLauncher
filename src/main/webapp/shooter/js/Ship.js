/**
 * Ship.
 */
function Ship(field, x, y) {
	Actor.apply(this, arguments);
	this.speed = 4;
	this.effect = false;
	this.shotList = [];
	this.trigger = false;
	this.anim = new Animator(this, 'ship001.png', Animator.TYPE.V, 1, Ship.PATTERNS * 2 + 1);
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

Ship.prototype.inkey = function(keys) {
	var hit = false;
	var dir = 0;

	if (keys['k37']) {
		dir = 1;
		hit = true;
	} else if (keys['k39']) {
		dir = -1;
		hit = true;
	}
	if (keys['k38']) {
		dir = 2 - dir * .5;
		hit = true;
	} else if (keys['k40']) {
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
	if (this.isGone) {
		return;
	}
	if (this.isHitWall) {
		this.fate();
		return;
	}
	if (this.x < this.hW || this.right < this.x) {
		this.x = this.svX;
	}
	if (this.y < this.hH || this.bottom < this.y) {
		this.y = this.svY;
	}
	// shot & missile
	this.sieveShots();
	if (this.trigger) {
		var result = [];
		this.trigger = false;
		if (this.shotList.length < Ship.MAX_SHOTS) {
			var shot = new Shot(this.field, this.x + this.hW, this.y);

			this.shotList.push(shot);
			result.push(shot);
//			result.push(new Missile(this.field, this.x + this.hW, this.y));
		}
		return result;
	}
};
