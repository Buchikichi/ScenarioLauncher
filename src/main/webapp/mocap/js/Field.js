/**
 * Field.
 * @author Hidetaka Sasai
 */
function Field() {
	this.motionNo = 0;
	this.rotationH = 155 * Math.PI / 180;
	this.rotationV = Math.PI / 8;
	this.animaList = [];
	this.init();
}
Field.WIDTH = 960;
Field.HEIGHT = 540;
Field.COLOR_LIST = ['lightpink', 'palegreen', 'lightskyblue', 'orange'];

Field.prototype.init = function() {
	var canvas = document.getElementById('canvas');

	this.ctx = canvas.getContext('2d');
};

Field.prototype.resetCanvas = function(width, height) {
	this.width = width;
	this.height = height;
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.scale = width / Field.WIDTH;
	$('#canvas').attr('width', this.width).attr('height', this.height);
};

Field.prototype.loadMotion = function(name) {
	var field = this;
	var slider = $('#slider');

	field.shiftMotion(0);
	slider.val(0).slider('refresh');
	return $.ajax('dat/' + name, {
		'dataType': 'json',
		'success': function(data) {
console.log('motions:' + data.motion.length);
			field.animaList.push(new Anima(data));

			field.resetMotion();
			slider.prop('max', data.motion.length - 1);
			slider.slider('refresh');
		}
	});
};

Field.prototype.resetMotion = function() {
	var field = this;

	this.shiftMotion(0);
	this.rotateH(0);
	this.rotateV(0);
	this.draw();
};

Field.prototype.shiftMotion = function(motionNo) {
	var field = this;
	var direction = motionNo < this.motionNo ? -1 : 1;

	while (this.motionNo != motionNo) {
		if (0 < direction) this.motionNo += direction;
		this.animaList.forEach(function(anima) {
			anima.shift(field.motionNo, direction);
			anima.calculate(field.motionNo != motionNo);
		});
		if (direction < 0) this.motionNo += direction;
	}
};

Field.prototype.nextMotion = function(motionNo) {
	var motionNo = this.motionNo;

	motionNo++;
	this.shiftMotion(motionNo);
};

Field.prototype.rotateH = function(diff) {
	var field = this;

	this.rotationH += (Math.PI / 720) * diff;
	this.rotationH = Math.trim(this.rotationH);
	this.animaList.forEach(function(anima) {
		anima.rotateH(field.rotationH);
	});
	var panValue = Math.abs(this.rotationH / Math.PI);

	AudioMixer.INSTANCE.panNode.pan.value = panValue;
};

Field.prototype.rotateV = function(diff) {
	var field = this;

	this.rotationV += (Math.PI / 720) * diff;
	this.rotationV = Math.trim(this.rotationV);
	this.animaList.forEach(function(anima) {
		anima.rotateV(field.rotationV);
	});
};

Field.prototype.draw = function() {
	var ctx = this.ctx;
	var colors = Field.COLOR_LIST.length;

	ctx.clearRect(0, 0, this.width, this.height);
	ctx.save();
	ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
	ctx.strokeText('H:' + Math.floor(this.rotationH * 180 / Math.PI), 2, 20);
	ctx.strokeText('V:' + Math.floor(this.rotationV * 180 / Math.PI), 2, 30);
	ctx.strokeText('m:' + this.motionNo, 2, 40);
	ctx.translate(this.hW, this.hH);
	ctx.scale(this.scale, this.scale);
//ctx.beginPath();
//ctx.fillStyle = 'rgba(120, 200, 255, 0.7)';
//ctx.arc(0, 0, 3, 0, Math.PI * 2, false);
//ctx.fill();
	ctx.lineCap = 'round';
	this.animaList.forEach(function(anima, ix) {
		ctx.strokeStyle = Field.COLOR_LIST[ix % colors];
		anima.draw(ctx);
	});
	ctx.restore();
};
