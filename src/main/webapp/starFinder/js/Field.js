/**
 * Field.
 */
function Field() {
	this.stars = [];
	this.starMap = {};
	this.maxMag = 0;
	this.constellations = [];
	this.showConstellation = false;
	this.dx = 0;
	this.rotationH = 0;
	this.rotationV = 0;
	this.seekTarget = null;
	this.magnification = 1;
	this.init();
}
Field.MIN_RAD = Math.PI / 900;

Field.prototype.init = function() {
	var view = $('#view');
	var canvas = document.getElementById('canvas');

	this.ctx = canvas.getContext('2d');
	this.loadStars();
	this.loadConstellation();
	this.ripple = new Ripple(this);
};

Field.prototype.resetCanvas = function(width) {
	this.width = width;
	this.height = width;
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	$('#canvas').attr('width', this.width).attr('height', this.height);
	this.ctx.font = "12px 'Times New Roman'";
	this.zoom(0);
};

Field.prototype.loadStars = function() {
	var field = this;

	$.ajax('dat/hipparcos.json', {
		'success': function(list) {
			// {"dec":-0.29169937,"id":32349,"ra":1.76781854,"s":"A","v":-144}
			list.forEach(function(rec) {
				var star = new Star(field, rec.ra, rec.dec, rec.v, rec.s);

				field.stars.push(star);
				field.starMap[rec.id] = star;
			});
			console.log('hipparcos:' + list.length);
		}
	});
};

Field.prototype.loadConstellation = function() {
	var field = this;

	$.ajax('dat/constellation.json', {
		'success': function(list) {
			console.log('constellation.json:' + list.length);
			field.constellations = list;
		}
	});
};

Field.prototype.rotateH = function(diff) {
	this.dx = diff;
	if (20 < Math.abs(this.dx)) {
		var max = this.dx < 0 ? -20 : 20;

		this.dx = max;
	}
};

Field.prototype.rotateV = function(diff) {
	this.rotationV -= diff * Math.PI / 1800;
	if (this.rotationV < -Math.SQ) {
		this.rotationV = -Math.SQ;
	} else if (Math.SQ < this.rotationV) {
		this.rotationV = Math.SQ;
	}
};

Field.prototype.zoom = function(delta) {
	this.magnification += delta / 4;
	if (this.magnification < 1) {
		this.magnification = 1;
	}
	this.radius = this.width * this.magnification / 2;
};

Field.prototype.seek = function() {
	if (arguments.length == 1) {
		this.seekTarget = this.starMap[arguments[0]];
	} else {
		this.seekTarget = new Star(this, arguments[0], arguments[1]);
	}
	this.ripple.stop();
};

Field.prototype.drawConstellation = function(rhRad, rvRad) {
	if (!this.showConstellation) {
		return;
	}
	var field = this;
	var ctx = this.ctx;
	// {"list":[{"from":677,"to":3092},{"from":3092,"to":5447},{"from":9640,"to":5447},{"from":5447,"to":4436},{"from":4436,"to":3881}],"name":"And","pos":677}
	this.constellations.forEach(function(rec) {
		var cons = field.starMap[rec.pos];

		if (!cons) {
			return;
		}
		cons.move(rhRad, rvRad);
		if (0 < cons.z) {
			ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
			ctx.fillText(rec.name, cons.x, cons.y);
		}
		ctx.strokeStyle = 'rgba(32, 80, 128, 0.6)';
		rec.list.forEach(function(line) {
			var from = field.starMap[line.from];
			var to = field.starMap[line.to];

			from.move(rhRad, rvRad);
			to.move(rhRad, rvRad);
			if (0 < from.z && 0 < to.z) {
				ctx.beginPath();
				ctx.moveTo(from.x, from.y);
				ctx.lineTo(to.x, to.y);
				ctx.stroke();
			}
		});
	});
};

Field.prototype.drawStars = function(rhRad, rvRad) {
	var cnt = 0;
	var ctx = this.ctx;
	var maxV = this.maxMag * 100;

	this.stars.forEach(function(star) {
		if (maxV < star.v) {
			return;
		}
		star.move(rhRad, rvRad);
		star.draw(ctx);
		cnt++;
	});
	return cnt;
};

Field.prototype.draw = function() {
	if (!this.ctx) {
		return;
	}
	var field = this;
	var ctx = this.ctx;
	var rhRad = this.rotationH;
	var rvRad = -this.rotationV;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.translate(this.hW, this.hH);
	this.drawConstellation(rhRad, rvRad);
	var cnt = this.drawStars(rhRad, rvRad);
	ctx.restore();
	ctx.fillStyle = 'white';
	ctx.fillText('stars:' + cnt, 0, 20);
//	ctx.fillText('h:' + this.rotationH, 0, 40);
	ctx.fillText('v:' + this.rotationV, 0, 40);
	// rotation
	if (this.dx != 0) {
		this.rotationH += this.dx * Math.PI / 300;
		this.rotationH = Math.trim(this.rotationH);
	}
	if (0 < Math.abs(this.dx)) {
		var sign = this.dx < 0 ? -1 : 1;

		this.dx += -sign;
	}
	// seek
	if (this.seekTarget) {
		var target = this.seekTarget;
		var dec = target.dec;
		var ra = -target.ra;
		var pitchV = Math.abs(Math.trim(this.rotationV - dec)) / 8;
		var pitchH = Math.abs(Math.trim(this.rotationH - ra)) / 8;
		var moved = false;

		if (Field.MIN_RAD <= pitchV) {
			this.rotationV = Math.close(this.rotationV, dec, pitchV);
			moved = true;
		}
		if (Field.MIN_RAD <= pitchH) {
			this.rotationH = Math.close(this.rotationH, ra, pitchH);
			moved = true;
		}
		if (!moved) {
			target.move(rhRad, rvRad);
			this.ripple.begin(target.x, target.y);
			this.seekTarget = null;
		}
	}
	this.ripple.draw(ctx);
};
