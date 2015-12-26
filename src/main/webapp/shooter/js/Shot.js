/**
 * Shot.
 */
function Shot(field, x, y) {
	this.field = field;
	this.x = x;
	this.y = y;
	this.width = 8;
	this.height = 2;
	this.speed = 16;
	this.size = 2;
	this.sfx = new Audio();
	this.sfx.src = 'audio/sfx-fire.mp3';
	this.sfx.volume = .5;
	this.sfx.play();
}

Shot.prototype.move = function() {
	this.x += this.speed;
};

Shot.prototype.fate = function() {
	this.x = this.field.width;
};

Shot.prototype.isOut = function() {
	return this.field.width < this.x;
};

Shot.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
	ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
	ctx.fill();
	this.move();
};
