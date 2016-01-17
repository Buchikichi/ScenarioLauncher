/**
 * Field.
 */
function Field(width, height) {
	this.width = width;
	this.height = height;
	this.stars = [];
	this.starMap = {};
	this.maxMag = 0;
	this.constellations = [];
	this.showConstellation = false;
	this.dx = 0;
	this.rotationH = 0;
	this.rotationV = 0;
	this.init();
}

Field.prototype.init = function() {
	var view = $('#view');
	var canvas = $('<canvas></canvas>').attr('width', this.width).attr('height', this.height);

	view.append(canvas);
	this.ctx = canvas.get(0).getContext('2d');
	this.ctx.font = "12px 'Times New Roman'";
	this.loadStars();
	this.loadConstellation();
};

Field.prototype.loadStars = function() {
	var field = this;

	$.ajax('dat/hipparcos.json', {
		'success': function(list) {
			// {"dec":-0.29169937,"id":32349,"ra":1.76781854,"s":"A","v":-144}
			list.forEach(function(rec) {
				var x = parseInt(Math.random() * field.width);
				var y = parseInt(Math.random() * field.height);
				var star = new Star(field, rec.ra, rec.dec, rec.v, rec.s, x, y);

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
	this.rotationV -= diff / 4;
	if (90 < this.rotationV) {
		this.rotationV = 90;
	} else if (this.rotationV < -90) {
		this.rotationV = -90;
	}
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
		ctx.strokeStyle = 'rgba(32, 80, 128, 0.4)';
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
	var field = this;
	var ctx = this.ctx;
	var hW = this.width / 2;
	var hH = this.height / 2;
	var rhRad = this.rotationH * Math.PI / 180;
	var rvRad = -this.rotationV * Math.PI / 180;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.translate(hW, hH);
	this.drawConstellation(rhRad, rvRad);
	var cnt = this.drawStars(rhRad, rvRad);
	ctx.restore();
	ctx.fillStyle = 'white';
	ctx.fillText('stars:' + cnt, 0, 20);
//	ctx.fillText('h:' + this.rotationH, 0, 40);
	ctx.fillText('v:' + this.rotationV, 0, 40);
	// rotation
	this.rotationH += this.dx;
	this.rotationH %= 360;
	if (0 < Math.abs(this.dx)) {
		var sign = this.dx < 0 ? -1 : 1;

		this.dx += -sign;
	}
};
