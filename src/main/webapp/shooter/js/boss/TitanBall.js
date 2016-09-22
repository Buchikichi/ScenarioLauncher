/**
 * TitanBall.
 */
function TitanBall(field, x, y) {
	Enemy.apply(this, arguments);
	this.margin = Field.HALF_WIDTH;
	this.speed = 3 + Math.random() * 8;
	this.gravity = .04;
	this.hitPoint = 4;
	this.anim = new Animator(this, 'boss/titan/titan.ball.png', Animator.TYPE.NONE);
}
TitanBall.prototype = Object.create(Enemy.prototype);
TitanBall.prototype.trigger = NOP;

TitanBall.prototype._react = Enemy.prototype.react;
TitanBall.prototype.react = function() {
	this._react();
	this.fate(this);
};
