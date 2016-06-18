/**
 * EnmDragonBody.
 */
function EnmDragonBody() {
	Enemy.apply(this, arguments);
	this.hitPoint = Number.MAX_SAFE_INTEGER;
	this.score = 0;
	this.img.src = 'img/enmDragonBody.png';
}

EnmDragonBody.prototype = Object.create(Enemy.prototype);

EnmDragonBody.prototype.move = function(target) {
	if (0 < this.explosion) {
		this.explosion--;
		if (this.explosion == 0) {
			this.eject();
		}
	}
};

EnmDragonBody.prototype.trigger = function() {
	// nop
};
