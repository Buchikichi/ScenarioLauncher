/**
 * Molten.
 */
function Molten() {
	Enemy.apply(this, arguments);
	this.margin = Field.HALF_WIDTH;
	this.dir = 0;
	this.speed = 1;
	this.effectH = false;
	this.hitPoint = Number.MAX_SAFE_INTEGER;
	this.cycle = 0;
	this.phase = Molten.PHASE.TARGET;
	this.rock = [];
	this.appears = false;
	this.anim = new Animator(this, 'boss.Molten.png', Animator.TYPE.NONE);
	this.routine = [
		new Movement().add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE)
	];
}
Molten.MAX_CYCLE = 500;
Molten.PHASE = {
	OWN: 0,
	TARGET: 1,
	length: 2
};
Molten.prototype = Object.create(Enemy.prototype);

Molten.prototype._move = Enemy.prototype.move;
Molten.prototype.move = function(target) {
	this._move(target);
	if (Molten.MAX_CYCLE < this.cycle++) {
		this.cycle = 0;
		this.phase++;
		this.phase %= Molten.PHASE.length;
	}
	if (this.appears) {
		this.checkDestroy(target);
		return [];
	}
	this.appears = true;
	var rock = new MoltenRock(this.field, this.x, this.y, this);
	this.rock = [rock];
	return [rock];
};

Molten.prototype.checkDestroy = function(target) {
	var validList = [];
	this.rock.forEach(function(rock) {
		if (!rock.isGone) {
			validList.push(rock);
		}
	});
	if (validList.length == 0) {
		this.hitPoint = 0;
		this.fate(target);
	}
	this.rock = validList;
};

/**
 * MoltenRock.
 */
function MoltenRock(field, x, y, parent) {
	Enemy.apply(this, arguments);
	this.margin = Field.HALF_WIDTH;
	this.parent = parent;
	this.dir = 0;
	this.speed = 1.3;
	this.hitPoint = 5;
	this.score = 10;
	this.anim = new Animator(this, 'boss.MoltenRock.png', Animator.TYPE.NONE);
	this.routine = [
		new Movement().add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE)
	];
}
MoltenRock.prototype = Object.create(Enemy.prototype);

MoltenRock.prototype._move = Enemy.prototype.move;
MoltenRock.prototype.move = function(target) {
	var result = [];
	var parent = this.parent;

	if (parent.phase == Molten.PHASE.OWN) {
		result = this._move(parent);
	} else {
		this._move(target);
	}
	if (this.absorbed && this.hitPoint) {
		var dir = Math.trim(this.dir + Math.SQ);
		for (var cnt = 0; cnt < 3; cnt++) {
			var child = new MoltenRock(this.field, this.x, this.y, parent);

			child.dir = dir;
			child.speed = this.speed * 1.2;
			child.hitPoint = this.hitPoint;
			result.push(child);
			parent.rock.push(child);
			dir = Math.trim(dir + Math.SQ);
		}
	}
	this.absorbed = false;
	return result;
};
