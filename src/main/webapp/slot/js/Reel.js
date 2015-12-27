/**
 * Reel.
 */
function Reel(ix, pattern) {
	this.ix = ix;
	this.pattern = pattern;
	this.degree = this.FACE_HEIGHT;
	this.mark = parseInt(this.degree / this.FACE_HEIGHT);
	this.steps = 0;
	this.status = 0; // status={0:stopped, 1:rotating, 2:down, 3:up, 4:judge}
	this.idle = 0;
//	this.sfx = new Audio();
//	this.sfx.src = 'audio/sfx-explosion.mp3';
//	this.sfx.volume = .4;
	this.setupElement();
}

Reel.prototype.FACE_HEIGHT = 40;
Reel.prototype.MAX_DEGREE = Reel.prototype.FACE_HEIGHT * 21;
Reel.prototype.IDLE_TICK = 10;

Reel.prototype.setupElement = function() {
	var reel = this;

	this.element = $('<div></div>').attr('id', 'reel' + this.ix).addClass('reel');
	this.element.mousedown(function() {
		reel.stop();
	});
	for (var cnt = 0; cnt < 3; cnt++) {
		var row = $('<div></div>').append($('<span></span>'));

		this.element.append(row);
	}
};

Reel.prototype.start = function() {
	this.status = 1;
	this.idle = parseInt(Math.random() * this.IDLE_TICK) + this.IDLE_TICK / 2;
};

Reel.prototype.stop = function() {
	if (this.status != 1) {
		return;
	}
	if (0 < this.idle) {
		return;
	}
	this.status = 2;
	this.mark = parseInt(this.degree / this.FACE_HEIGHT);
};

Reel.prototype.isJudge = function() {
	return this.status == 4;
};

Reel.prototype.move = function() {
	//this.element.find('span:first').text('M:' + this.mark + '/D:' + this.degree);
	if (this.status == 0 || this.status == 4) {
		return;
	}
	if (0 < this.idle) {
		this.idle--;
	}
	if (this.status == 1) {
		if (this.steps < 16) {
			this.steps += 2;
		}
	} else if (this.status == 2) {
		var markPos = this.mark * this.FACE_HEIGHT;
		var diff = Math.abs(markPos - this.degree);

		if (diff < 16) {
			this.degree = markPos - 10;
			this.steps = -4;
			this.status = 3;
			return;
		}
	} else if (this.status == 3) {
		var markPos = this.mark * this.FACE_HEIGHT;
		if (markPos <= this.degree) {
			this.degree = markPos;
			this.status = 4;
			return;
		}
	}
	this.degree -= this.steps;
	if (this.degree < 0) {
		this.degree += this.MAX_DEGREE;
	}
};

Reel.prototype.draw = function() {
	var top = -this.degree + 10;
	var position = '0px ' + top + 'px';

	this.element.css('background-position', position);
	this.move();
};
