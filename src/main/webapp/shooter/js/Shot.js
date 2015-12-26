/**
 * Shot.
 */
function Shot() {
	Actor.apply(this, arguments);
	this.dx = 1;
	this.dy = 0;
	this.width = 8;
	this.height = 2;
	this.speed = 16;
	this.size = 2;
	this.sfx.src = 'audio/sfx-fire.mp3';
	this.sfx.volume = .5;
	this.sfx.play();
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
};
