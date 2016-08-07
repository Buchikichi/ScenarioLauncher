/**
 * Shot.
 */
function Shot() {
	Actor.apply(this, arguments);
	this.dir = 0;
	this.width = 16;
	this.height = 8;
	this.recalculation();
	this.speed = 12;
	this.effectH = false;
	this.size = 2;
	this.maxX = this.field.width;

	var pan = (this.x - Field.HALF_WIDTH) / Field.HALF_WIDTH;
	AudioMixer.INSTANCE.play('sfx-fire', .4, false, pan);
}
Shot.prototype = Object.create(Actor.prototype);

Shot.prototype.fate = function() {
	this.x = this.field.width + this.width;
	this.isGone = true;
};

Shot.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
	ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
	ctx.fill();
	if (this.isHitWall) {
		this.fate();
	}
};
