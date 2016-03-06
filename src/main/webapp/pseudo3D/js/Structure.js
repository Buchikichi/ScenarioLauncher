/**
 * Structure.
 */
function Structure(field, x, y, z, img) {
	Actor.apply(this, arguments);
	this.z = z;
	this.dx = 0;
	this.dy = 0;
	this.dz = 6;
	this.speed = 1;
	this.recalculation();
	this.img.src = img;
}
Structure.prototype = Object.create(Actor.prototype);

Structure.prototype.beforeMove = function() {
	this.z += this.dz * this.speed;

	if (Field.MAX_Z < this.z) {
		this.isGone = true;
	}
};
Structure.prototype.afterMove = function() {
};
Structure.prototype.calcPos = function(dx, dy) {
	var ax = this.x + dx;
	var ay = -this.y + dy;
	var az = this.z;
	var radX = this.field.radX;
	var radY = this.field.radY;
	var px = Math.cos(radY) * ax - Math.sin(radY) * az;
	var nz = Math.sin(radY) * ax + Math.cos(radY) * az;
	var py = Math.cos(radX) * ay - Math.sin(radX) * nz;
	var zoom = az * az / (Field.POS_Z * Field.POS_Z);

	return {px: px * zoom, py: py * zoom, zoom: zoom};
};
/**
 * Draw.
 * @param ctx
 */
Structure.prototype.drawNormal = function(ctx) {
	var field = this.field;
	var pos = this.calcPos(0, 0);
	var posLT = this.calcPos(-this.hW, -this.hH);
	var posRB = this.calcPos(this.hW, this.hH);
	var width = posRB.px - posLT.px;
	var height = posRB.py - posLT.py;
	var scale = pos.zoom;

	ctx.save();
	ctx.scale(scale, scale);
	ctx.drawImage(this.img, 0, 0, this.width, this.height, posLT.px, posLT.py, width, height);

//	ctx.beginPath();
//	ctx.rect(posLT.px, posLT.py, width, height);
//	ctx.stroke();
//	ctx.fillStyle = 'rgba(32, 32, 32, .7)';
//	ctx.fillText('x:' + this.x + 'y:' + this.y + 'z:' + this.z + '/scale:' + scale, posLT.px, posLT.py);
//	ctx.fillStyle = 'rgba(255, 80, 80, 1)';
//	ctx.beginPath();
//	ctx.arc(posLT.px, posLT.py, 2, 0, Math.PI * 2, false);
//	ctx.arc(posRB.px, posRB.py, 2, 0, Math.PI * 2, false);
//	ctx.fill();
	ctx.restore();
};
