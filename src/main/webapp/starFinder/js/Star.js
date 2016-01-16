/**
 * Star.
 */
function Star(field, ra, dec, v, spect, x, y) {
	this.field = field;
	this.ra = ra;
	this.dec = dec;
	this.v = v;
	this.color = this.getColor(spect);
	this.x = x;
	this.y = y;
}
Star.prototype.PI2 = Math.PI * 2;
Star.prototype.MAX_D = 20;

Star.prototype.getColor = function(spect) {
	var color;

	switch (spect) {
	case 'O':
		color = 'rgba(34, 102, 255, 0.9)';
		break;
	case 'B':
		color = 'rgba(102, 255, 255, 0.9)';
		break;
	case 'A':
		color = 'rgba(255, 255, 255, 0.9)';
		break;
	case 'F':
		color = 'rgba(255, 255, 102, 0.9)';
		break;
	case 'G':
		color = 'rgba(255, 255, 34, 0.9)';
		break;
	case 'K':
		color = 'rgba(255, 136, 68, 0.9)';
		break;
	case 'M':
		color = 'rgba(255, 0, 0, 0.9)';
		break;
	default:
		color = 'rgba(34, 34, 204, 0.9)';
		break;
	}
	return color;
};

Star.prototype.move = function(rotationRad) {
	var ptX = 0;
	var ptY = 0;
	var ptZ = this.field.width / 2;
	var wx = ptX;
	var wy = ptY;
	var wz = ptZ;
	var raRad = this.ra + rotationRad;
	var radX = 0; //this.latRad;
	var decRad = this.dec;
	var degreeZ = 0;

	ptY = Math.cos(decRad) * wy - Math.sin(decRad) * wz;
	ptZ = Math.sin(decRad) * wy + Math.cos(decRad) * wz;
//console.log(ptY);
	wz = ptZ;
	ptX = Math.cos(raRad) * wx - Math.sin(raRad) * wz;
	ptZ = Math.sin(raRad) * wx + Math.cos(raRad) * wz;
	wy = ptY;
	wz = ptZ;
	ptY = Math.cos(radX) * wy - Math.sin(radX) * wz;
	this.z = Math.sin(radX) * wy + Math.cos(radX) * wz;
	if (this.z < 0) {
		return;
	}
	wx = ptX;
	wy = ptY;
	this.x = Math.cos(degreeZ) * wx - Math.sin(degreeZ) * wy;
	this.y = Math.sin(degreeZ) * wx + Math.cos(degreeZ) * wy;
//console.log('x:' + this.x);
}

Star.prototype.draw = function(ctx) {
	if (this.z < 0) {
		return;
	}
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x, this.y, 1, 0, this.PI2, false);
	ctx.fill();
};
