/**
 * Star.
 */
function Star(field, ra, dec, v, spect) {
	this.field = field;
	this.ra = ra;
	this.dec = dec;
	this.v = v;
	this.ratio = this.getRatio(v);
	this.color = this.getColor(spect);
}
Star.MIN_V = -144;
Star.MAX_V = 1408;
Star.V_WIDTH = Star.MAX_V - Star.MIN_V;

Star.prototype.getRatio = function(v) {
	return (Star.V_WIDTH - (v - Star.MIN_V)) / Star.V_WIDTH;
};

Star.prototype.getColor = function(spect) {
	var color;
	var alpha = this.ratio * .5;

	switch (spect) {
	case 'O':
		color = 'rgba(90, 160, 255, ' + alpha + ')';
		break;
	case 'B':
		color = 'rgba(190, 255, 255, ' + alpha + ')';
		break;
	case 'A':
		color = 'rgba(255, 255, 255, ' + alpha + ')';
		break;
	case 'F':
		color = 'rgba(255, 255, 102, ' + alpha + ')';
		break;
	case 'G':
		color = 'rgba(255, 255, 34, ' + alpha + ')';
		break;
	case 'K':
		color = 'rgba(255, 136, 68, ' + alpha + ')';
		break;
	case 'M':
		color = 'rgba(255, 80, 80, ' + alpha + ')';
		break;
	default:
		color = 'rgba(34, 34, 204, ' + alpha + ')';
		break;
	}
	return color;
};

Star.prototype.move = function(rhRad, rvRad) {
	var ptX = 0;
	var ptY = 0;
	var wx = ptX;
	var wz = this.field.radius;
	var raRad = this.ra + rhRad;
	var radX = rvRad; //this.latRad;
	var decRad = this.dec;
	var radZ = 0;

	var wy = -Math.sin(decRad) * wz;
	wz = Math.cos(decRad) * wz;
	ptX = -Math.sin(raRad) * wz;
	wz = Math.cos(raRad) * wz;
	ptY = Math.cos(radX) * wy - Math.sin(radX) * wz;
	this.z = Math.sin(radX) * wy + Math.cos(radX) * wz;
	if (this.z < 0) {
		return;
	}
	wx = ptX;
	wy = ptY;
	this.x = Math.cos(radZ) * wx - Math.sin(radZ) * wy;
	this.y = Math.sin(radZ) * wx + Math.cos(radZ) * wy;
//console.log('x:' + this.x);
};

Star.prototype.draw = function(ctx) {
	if (this.z < 0) {
		return;
	}
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.arc(this.x, this.y, this.ratio * 2.8, 0, Math.PI2, false);
	ctx.fill();
};
