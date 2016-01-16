/**
 * Field.
 */
function Field(width, height) {
	this.width = width;
	this.height = height;
	this.stars = [];
	this.starMap = {};
	this.maxMag = 0;
	this.dx = 0;
	this.rotationH = 0;
	this.init();
}

Field.prototype.init = function() {
	var view = $('#view');
	var canvas = $('<canvas></canvas>').attr('width', this.width).attr('height', this.height);

	view.append(canvas);
	this.ctx = canvas.get(0).getContext('2d');
	this.ctx.font = "12px 'Times New Roman'";
	this.loadStars();
};

Field.prototype.loadStars = function() {
	var field = this;

	$.ajax('dat/hipparcos.json', {
		'success': function(list) {
			// {"dec":-0.29169937,"id":32349,"ra":1.76781854,"s":"A","v":-144}
			console.log('hipparcos:' + list.length);
			list.forEach(function(rec) {
				var x = parseInt(Math.random() * field.width);
				var y = parseInt(Math.random() * field.height);
				var star = new Star(field, rec.ra, rec.dec, rec.v, rec.s, x, y);

				field.stars.push(star);
				field.starMap[rec.id] = star;
			});
		}
	});
};

Field.prototype.rotateH = function(diff) {
	this.dx = diff;
	if (30 < Math.abs(this.dx)) {
		var max = this.dx < 0 ? -30 : 30;

		this.dx = max;
	}
};

Field.prototype.draw = function() {
	var field = this;
	var ctx = this.ctx;
	var cnt = 0;
	var hW = this.width / 2;
	var hH = this.height / 2;
	var maxV = this.maxMag * 100;
	var rotationRad = this.rotationH * Math.PI / 180;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.translate(hW, hH);
	this.stars.forEach(function(star) {
		if (maxV < star.v) {
			return;
		}
		star.move(rotationRad);
		star.draw(ctx);
		cnt++;
	});
	ctx.restore();
	ctx.strokeStyle = 'white';
	ctx.strokeText('stars:' + cnt, 0, 20);
//	ctx.strokeText('h:' + this.rotationH, 0, 40);
	// rotation
	this.rotationH += this.dx / 2;
	this.rotationH %= 360;
	if (0 < Math.abs(this.dx)) {
		var sign = this.dx < 0 ? -1 : 1;

		this.dx += -sign;
	}
};
