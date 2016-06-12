/**
 * Field.
 */
function Field() {
	this.lib = new Lib(131, 137, 'img/lib.png');
	this.rab = new Rab(157, 137, 'img/rab.png').unshift(this.lib);
	this.actors = [this.lib, this.rab];
	this.init();
	this.resetParams();

	this.bg = new Image();
	this.bg.src = 'img/bg.png';
}
Field.WIDTH = 320;
Field.HEIGHT = 224;
Field.CENTER_Y = Field.HEIGHT / 2;
Field.MIN_Y = 32;
Field.MAX_Y = 200;
Field.POS_Z = 320;
Field.MAX_Z = 320;
Field.CELL_WIDTH = 32;
Field.PICKET = [
	[15, 60], [47, 60], [79, 60], [111, 60], [143, 60], [175, 60], [207, 60], [239, 60], [271, 60],
	[15, 92], [47, 92], [79, 92], [111, 92], [143, 92], [175, 92], [207, 92], [239, 92], [271, 92],
	[15, 124], [47, 124], [79, 124], [111, 124], [143, 124], [175, 124], [207, 124], [239, 124], [271, 124],
	[15, 156], [47, 156], [79, 156], [111, 156], [143, 156], [175, 156], [207, 156], [239, 156], [271, 156],
	[15, 188], [47, 188], [79, 188], [111, 188], [143, 188], [175, 188], [207, 188], [239, 188], [271, 188],
];

Field.prototype.resetParams = function() {
	var picketList = [];
	Field.PICKET.forEach(function(pos) {
		picketList.push(new Picket(pos[0], pos[1]));
	});
	this.picketList = picketList;
};

Field.prototype.init = function() {
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.resize(1);
};

Field.prototype.resize = function(magni) {
	var canvas = $(this.canvas);

	this.width = Field.WIDTH * magni;
	this.height = Field.HEIGHT * magni;
	this.cx = this.width / 2;
	this.cy = this.height / 2;
	this.magni = magni;
	canvas.attr('width', this.width);
	canvas.attr('height', this.height);
};

Field.prototype.inkey = function(keys) {
	this.lib.dx = 0;
	this.lib.dy = 0;
	this.rab.dx = 0;
	this.rab.dy = 0;

	if (keys['k83']) {
		this.lib.dx = -1;
	}
	if (keys['k70']) {
		this.lib.dx = 1;
	}
	if (keys['k69']) {
		this.lib.dy = -1;
	}
	if (keys['k68']) {
		this.lib.dy = 1;
	}
	if (keys['k37']) {
		this.rab.dx = -1;
	}
	if (keys['k39']) {
		this.rab.dx = 1;
	}
	if (keys['k38']) {
		this.rab.dy = -1;
	}
	if (keys['k40']) {
		this.rab.dy = 1;
	}
};

Field.prototype.drawPicket = function() {
	var ctx = this.ctx;

//	ctx.fillStyle = 'rgba(200, 200, 200, .4)';
	ctx.fillStyle = 'rgba(255, 143, 0, 1)';
	this.picketList.forEach(function(picket) {
		picket.draw(ctx);
	});
};

Field.prototype.drawGuide = function(picket, radian, height) {
	var px = picket.x;
	var py = picket.y;
	var sx = px + Math.cos(radian) * height;
	var sy = py + Math.sin(radian) * height;
	var ctx = this.ctx;

	ctx.fillStyle = 'rgba(255, 32, 32, .4)';
	ctx.beginPath();
	ctx.arc(sx, sy, 1, 0, Math.PI * 2, false);
	ctx.fill();
//	ctx.fillText(parseInt(height), sx, sy);
	ctx.beginPath();
	ctx.moveTo(px, py);
	ctx.lineTo(sx, sy);
	ctx.stroke();
};

Field.prototype.inUse = function(pt) {
	var isExists = false;
	var target = this.lib;

	target = target.next;
	while (target) {
		if (target.id == pt.id) {
			isExists = true;
			break;
		}
		target = target.next;
	}
	return isExists;
};

Field.prototype.separate = function(player) {
	var isLib = player instanceof Lib;
	var joint = isLib ? player.next : player.prev;

	if (joint instanceof Player) {
		return;
	}
	var picket = joint.parent;
	var p3 = isLib ? joint.next : joint.prev;
	var di1 = new Diagonal(player, joint);
	var dist1 = di1.distanceFrom(picket);
	var sign1 = dist1 < 0 ? -1 : 1;
	var di2 = new Diagonal(player, p3);
	var dist2 = di2.distanceFrom(picket);
	var sign2 = dist2 < 0 ? -1 : 1;

//	if (!isLib) {
//		var ctx = this.ctx;
//		ctx.save();
//		ctx.strokeStyle = 'rgba(0, 255, 255, 1)';
//		ctx.fillStyle = 'rgba(0, 255, 255, 1)';
//		joint.drawContact(ctx);
//		ctx.fill();
//		ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
//		p3.drawContact(ctx);
//		ctx.restore();
//	}
	if (sign1 != sign2) {
		return;
	}
	if (Math.abs(dist2) <= Math.abs(dist1)) {
		return;
	}
//console.log('separate:' + dist1 + '/' + dist2);
	joint.remove();
};

Field.prototype.testPicket = function(player) {
	var field = this;
	var ctx = this.ctx;
	var isLib = player instanceof Lib;
	var prev = isLib ? player.next : player.prev;
	var di = new Diagonal(player, prev);
	var radian = di.radian + Math.PI / 2;
	var bounds = new Diagonal(player, prev).addMargin(1);
	var distMax = Number.MAX_VALUE;
	var candidate = null;

//	bounds.drawRect(ctx);
	this.picketList.forEach(function(picket) {
		if (picket.includes(player)) {
//console.log('over!');
			return;
		}
		if (!bounds.rectIncludes(picket)) {
			return;
		}
		var dist = di.distanceFrom(picket);
		var np = picket.derive(radian, dist);

		np.drawContact(ctx);
		field.drawGuide(picket, radian, dist);
		if (Math.abs(dist) < Picket.RADIUS && !field.inUse(np)) {
			var distFromPlayer = player.distanceFrom(np);

			if (distFromPlayer < distMax) {
				// playerからの距離を測って一番近いものだけ候補にする
				distMax = distFromPlayer;
				candidate = np;
			}
		}
	});
	if (candidate) {
		if (isLib) {
			player.push(candidate);
		} else if (player instanceof Rab) {
			player.unshift(candidate);
		}
	}
};

Field.prototype.testLine = function() {
	var ctx = this.ctx;

	this.drawPoint();
	ctx.save();
	ctx.lineWidth = .2;
	ctx.strokeStyle = 'rgba(255, 255, 64, .8)';
	this.testPicket(this.lib);
	this.testPicket(this.rab);
	this.separate(this.lib);
	this.separate(this.rab);
	ctx.restore();
};

Field.prototype.drawPoint = function() {
	var ctx = this.ctx;
	var target = this.lib.next;

	ctx.strokeStyle = 'rgba(40, 40, 40, 1)';
	ctx.fillStyle = 'rgba(40, 40, 40, .6)';
	while (target.next) {
		target.drawContact(ctx);
		ctx.fill();
		target = target.next;
	}
};

Field.prototype.drawLines = function() {
	var ctx = this.ctx;
	var target = this.lib;
	var cnt = 0;

	ctx.strokeStyle = 'rgba(0, 174, 210, 1)';
	ctx.beginPath();
	ctx.moveTo(target.x, target.y);
	target = target.next;
	while (target) {
		ctx.lineTo(target.x, target.y);
		target = target.next;
		cnt++;
	}
	ctx.stroke();
	ctx.fillStyle = 'rgba(0, 174, 210, 1)';
	ctx.fillText(cnt, 10, 32);
};

Field.prototype.divertPicket = function(player) {
	var px = player.x;
	var py = player.y;
	var step = Picket.RADIUS * 2 + 1;

	this.picketList.forEach(function(picket) {
		if (picket.includes(player)) {
			if (player.dx != 0) {
				var sign = py <= picket.y ? -1 : 1;

				player.y = picket.y + step * sign;
//console.log('dx:' + player.dx);
			} else {
				var sign = px <= picket.x ? -1 : 1;

				player.x = picket.x + step * sign;
//console.log('dy:' + player.dy);
			}
		}
	});
};

Field.prototype.drawActors = function() {
	var field = this;
	var ctx = this.ctx;

	this.actors.forEach(function(actor) {
		actor.move();
		if (actor.x < 0) {
			actor.x = 0;
		} else if (Field.WIDTH < actor.x) {
			actor.x = Field.WIDTH;
		}
		if (actor.y < 0) {
			actor.y = 0;
		} else if (Field.HEIGHT < actor.y) {
			actor.y = Field.HEIGHT;
		}
		if (actor instanceof Player) {
			field.divertPicket(actor);
		}
		actor.draw(ctx);
	});
};

Field.prototype.draw = function() {
	var ctx = this.ctx;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.scale(this.magni, this.magni);
//	ctx.drawImage(this.bg, 0, 0);
	this.drawLines();
	this.drawPicket();
	this.drawActors();
	this.testLine();
	ctx.restore();
};
