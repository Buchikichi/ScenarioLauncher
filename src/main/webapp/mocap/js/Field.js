/**
 * Field.
 * @author Hidetaka Sasai
 */
function Field() {
	this.motionNo = 0;
	this.init();
}

Field.prototype.init = function() {
	var canvas = document.getElementById('canvas');

	this.ctx = canvas.getContext('2d');
	this.loadAsf();
};

Field.prototype.resetCanvas = function(width) {
	this.width = width;
	this.height = width;
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	$('#canvas').attr('width', this.width).attr('height', this.height);
};

Field.prototype.loadAsf = function() {
	var field = this;

	return $.ajax('dat/asf.json', {
		'dataType': 'json',
		'success': function(data) {
			field.skeleton = new Skeleton(data);
		}
	});
};

Field.prototype.loadMotion = function(name) {
	var field = this;
	var slider = $('#slider');

	return $.ajax('dat/' + name, {
		'dataType': 'json',
		'success': function(data) {
			field.motion = data;
			field.shiftMotion(0);
			slider.prop('max', field.motion.length - 1);
			slider.val(0).slider('refresh');
		}
	});
};

Field.prototype.shiftMotion = function(motionNo) {
	this.skeleton.shift(this.motion[motionNo]);
	this.motionNo = motionNo;
};

Field.prototype.nextMotion = function(motionNo) {
	if (!this.motion) {
		return;
	}
	var motionNo = this.motionNo;

	motionNo++;
	if (this.motion.length <= motionNo) {
		motionNo = 0;
	}
	this.shiftMotion(motionNo);
};

Field.prototype.rotateH = function(diff) {
	if (!this.skeleton) {
		return;
	}
	this.skeleton.rotateH(diff);
};

Field.prototype.rotateV = function(diff) {
	if (!this.skeleton) {
		return;
	}
	this.skeleton.rotateV(diff);
};

Field.prototype.draw = function() {
	if (!this.skeleton) {
		return;
	}
	var ctx = this.ctx;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.strokeText('H:' + Math.floor(this.skeleton.rotationH * 180 / Math.PI), 2, 20);
	ctx.strokeText('V:' + Math.floor(this.skeleton.rotationV * 180 / Math.PI), 2, 30);
	ctx.strokeText('m:' + this.motionNo, 2, 40);
	ctx.translate(this.hW, this.hH);
	ctx.scale(5, 5);
//ctx.beginPath();
//ctx.fillStyle = 'rgba(120, 200, 255, 0.7)';
//ctx.arc(0, 0, 3, 0, Math.PI * 2, false);
//ctx.fill();
	this.skeleton.draw(ctx);
	ctx.restore();
};
