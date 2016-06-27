/**
 * EnmFormation.
 */
function EnmFormation() {
	Actor.apply(this, arguments);
	this.bonus = 800;
	this.score = this.bonus;
	this.steps = 0;
	this.count = 0;
	this.enemies = [];
}

EnmFormation.prototype = Object.create(Actor.prototype);

EnmFormation.STEP = 5;

EnmFormation.prototype.setup = function(type, num) {
	for (var ix = 0; ix < num; ix++) {
		this.enemies.push(new type(this.field, this.x, this.y));
	}
	return this;
};

EnmFormation.prototype.checkDestroy = function() {
	var formation = this;
	var enemies = [];

	this.enemies.forEach(function(enemy) {
		if (enemy.hitPoint == 0) {
			return;
		}
		enemies.push(enemy);
		formation.x = enemy.x;
		formation.y = enemy.y;
	});
	this.enemies = enemies;
	if (enemies.length == 0 && this.explosion == 0) {
		this.explosion = Actor.MAX_EXPLOSION * 4;
		return;
	}
};

EnmFormation.prototype._move = Actor.prototype.move;
EnmFormation.prototype.move = function(target) {
	this._move(target);
	if (this.enemies.length <= this.count) {
		this.checkDestroy();
		return;
	}
	if (this.steps++ % EnmFormation.STEP != 0) {
		return;
	}
	return [this.enemies[this.count++]];
};

EnmFormation.prototype.drawExplosion = function(ctx) {
	ctx.fillStyle = 'rgba(240, 240, 255, .8)';
	ctx.fillText(this.bonus, this.x, this.y);
};
