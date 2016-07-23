/**
 * EnmDragonHead.
 */
function EnmDragonHead() {
	Enemy.apply(this, arguments);
	if (0 < this.x) {
		this.x += 50;
	} else {
		this.x -= 50;
	}
	this.speed = 1.8;
	this.effect = false;
	this.hitPoint = 200;
	this.score = 1000;
	this.radian = Math.PI;
	this.appears = false;
	this.anim = new Animator(this, 'enmDragonHead.png', Animator.TYPE.NONE);

	this.locus = [];
	this.body = [];
	for (var cnt = 0; cnt < EnmDragonHead.CNT_OF_BODY * EnmDragonHead.STP_OF_BODY; cnt++) {
		this.locus.push({x:this.x, y:this.y, radian:this.radian});
		if (cnt % EnmDragonHead.STP_OF_BODY == 0) {
			var body = new EnmDragonBody(this.field, this.x, this.y);
			this.body.push(body);
		}
	}
}

EnmDragonHead.prototype = Object.create(Enemy.prototype);
EnmDragonHead.CNT_OF_BODY = 10;
EnmDragonHead.STP_OF_BODY = 16;

EnmDragonHead.prototype._recalculation = Actor.prototype.recalculation;
EnmDragonHead.prototype.recalculation = function() {
	this._recalculation();
	this.minX = -this.field.width;
	this.minY = -this.field.height;
	this.maxX = this.field.width * 2;
	this.maxY = this.field.height * 2;
};

EnmDragonHead.prototype._eject = Actor.prototype.eject;
EnmDragonHead.prototype.eject = function() {
	this._eject();
	this.body.forEach(function(body) {
		body.hitPoint = 0;
		body.explosion = Actor.MAX_EXPLOSION;
	});
};

EnmDragonHead.prototype._move = Enemy.prototype.move;
EnmDragonHead.prototype.move = function(target) {
	var rad = Math.trim(this.radian + this.closeGap(target) * 1.8);

	this.dir = rad;
	this.radian = rad;
	this._move(target);
//console.log('LEN:' + this.locus.length);
	for (var cnt = 0; cnt < EnmDragonHead.CNT_OF_BODY; cnt++) {
		var body = this.body[cnt];
		var ix = (cnt + 1) * EnmDragonHead.STP_OF_BODY - 1;
		var locus = this.locus[ix];

		body.x = locus.x;
		body.y = locus.y;
		body.radian = locus.radian;
	}
	this.locus.unshift({x:this.x, y:this.y, radian:this.radian});
	this.locus.pop();
	if (this.appears) {
		return;
	}
	this.appears = true;
	return this.body;
};
