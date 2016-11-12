/** One rotation(360 degree). */
Math.PI2 = Math.PI2 || Math.PI * 2;
/** Square(90 degree). */
Math.SQ = Math.SQ || Math.PI / 2;

/**
 * trim.
 * @return the range of -pi to pi.
 */
Math.trim = Math.trim || function(radian) {
	var rad = radian;

	while (Math.PI < rad) {
		rad -= Math.PI2;
	}
	while (rad < -Math.PI) {
		rad += Math.PI2;
	}
	return rad;
};

/**
 * close.
 */
Math.close = Math.close || function(src, target, pitch) {
	var diff = Math.trim(src - target);

	if (Math.abs(diff) <= pitch) {
		return src;
	}
	if (0 < diff) {
		return src - pitch;
	}
	return src + pitch;
};
/**
 * Matrix.
 * @author Hidetaka Sasai
 */
function Matrix(mat) {
	this.mat = mat;
}
Matrix.NO_EFFECT = new Matrix([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);

Matrix.rotateX = function(r) {
//	if (r == null) {
//		return Matrix.NO_EFFECT;
//	}
	return new Matrix([[1,0,0,0],[0,Math.cos(r),-Math.sin(r),0],[0,Math.sin(r),Math.cos(r),0],[0,0,0,1]]);
};

Matrix.rotateY = function(r) {
//	if (r == null) {
//		return Matrix.NO_EFFECT;
//	}
	return new Matrix([[Math.cos(r),0,Math.sin(r),0],[0,1,0,0],[-Math.sin(r),0,Math.cos(r),0],[0,0,0,1]]);
};

Matrix.rotateZ = function(r) {
//	if (r == null) {
//		return Matrix.NO_EFFECT;
//	}
	return new Matrix([[Math.cos(r),-Math.sin(r),0,0],[Math.sin(r),Math.cos(r),0,0],[0,0,1,0],[0,0,0,1]]);
};

/**
 * Multiply.
 * @param multiplicand matrix
 */
Matrix.prototype.multiply = function(multiplicand) {
	var result = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	var m = multiplicand.mat;

	this.mat.forEach(function(row, i) {
		row.forEach(function(col, j) {
			var sum = 0;

			for (var cnt = 0; cnt < 4; cnt++) {
				sum += row[cnt] * m[cnt][j];
			}
			result[i][j] = sum;
		});
	});
	return new Matrix(result);
};

Matrix.prototype.affine = function(x, y, z) {
	var m = this.mat;
	var nx = m[0][0] * x + m[0][1] * y + m[0][2] * z + m[0][3];
	var ny = m[1][0] * x + m[1][1] * y + m[1][2] * z + m[1][3];
	var nz = m[2][0] * x + m[2][1] * y + m[2][2] * z + m[2][3];

	return {x:nx, y:ny, z:nz};
};
/**
 * Anima.
 * @author Hidetaka Sasai
 */
function Anima(json) {
	var anima = this;

	this.skeleton = new Skeleton(json.skeleton);
	this.motion = [];
	json.motion.forEach(function(frame) {
		var line = [];

		frame.forEach(function(boneMotion, ix) {
			var mx = Matrix.NO_EFFECT;

			if (boneMotion != null) {
				var rx = Matrix.rotateX(boneMotion[0]);
				var ry = Matrix.rotateY(boneMotion[1]);
				var rz = Matrix.rotateZ(boneMotion[2]);
				var node = anima.skeleton.list[ix];
				var order = node.order.split('');

				order.forEach(function(o) {
					if (o == 'x') {
						mx = mx.multiply(rx);
					} else if (o == 'y') {
						mx = mx.multiply(ry);
					} else if (o == 'z') {
						mx = mx.multiply(rz);
					}
				});
			}
			var aMotion = {
				rotate : mx
			};
			if (boneMotion != null && 3 < boneMotion.length) {
				aMotion.tx = boneMotion[3];
				aMotion.ty = boneMotion[4];
				aMotion.tz = boneMotion[5];
			}
			line.push(aMotion);
		});
		anima.motion.push(line);
	});
}

Anima.prototype.rotateH = function(value) {
	this.skeleton.rotationH = value;
	this.skeleton.calcRotationMatrix();
};

Anima.prototype.rotateV = function(value) {
	this.skeleton.rotationV = value;
	this.skeleton.calcRotationMatrix();
};

Anima.prototype.shift = function(motionNo, direction) {
	var ix = motionNo % this.motion.length;

//console.log('ix:' + ix);
	this.skeleton.shift(this.motion[ix], direction);
};

Anima.prototype.calculate = function(isSimple) {
	this.skeleton.calculate(isSimple);
};

Anima.prototype.draw = function(ctx) {
	this.skeleton.draw(ctx);
};
/**
 * Skeleton.
 * @author Hidetaka Sasai
 */
function Skeleton(data) {
	this.data = data;
	this.calcOrder = this.data.calcOrder == 'RotateTranslate' ? 0 : 1;
	this.list = [];
	this.map = {};
	this.offsetX = 0;
	this.offsetY = 0;
	this.scale = data.scale;
	this.rotationH = Math.PI / 4;
	this.rotationV = Math.PI / 8;
	this.rotationMatrix = Matrix.NO_EFFECT;
	this.init();
}

Skeleton.prototype.init = function() {
	var root = Object.assign(new Bone(), this.data.root);

	this.data.root = root;
	this.prepare(root);
	this.calcRotationMatrix();
};

Skeleton.prototype.prepare = function(node) {
	var skeleton = this;
	var children = [];

	this.list.push(node);
	node.prepare();
	node.joint.forEach(function(child) {
		child.parent = node;
		children.push(Object.assign(new Bone(), child));
	});
	node.joint = children;
	node.joint.forEach(function(child) {
		skeleton.prepare(child);
	});
	node.skeleton = this;
	this.map[node.name] = node;
};

Skeleton.prototype.calcRotationMatrix = function() {
	var mh = Matrix.rotateY(this.rotationH);

	this.rotationMatrix = Matrix.rotateX(this.rotationV).multiply(mh);
};

Skeleton.prototype.shift = function(motionList, direction) {
	var skeleton = this;

	motionList.forEach(function(motion, ix) {
		var bone = skeleton.list[ix];

		bone.motionMatrix = motion.rotate;
		if (motion.tx) {
			// root
			var prev = bone.pt;
			var x = skeleton.offsetX + prev.x + motion.tx * direction;
			var y = skeleton.offsetY + prev.y + motion.ty * direction;
			var z = prev.z + motion.tz * direction;

			bone.translateMatrix = new Matrix([[1,0,0,x],[0,1,0,y],[0,0,1,z],[0,0,0,1]]);
		}
	});
};

Skeleton.prototype.calculate = function(isSimple) {
	this.data.root.calculate(isSimple);
};

Skeleton.prototype.draw = function(ctx) {
/*	var pt = this.data.root.pt;
	var mx = this.rotationMatrix;
	var nt = mx.affine(pt.x, pt.y, pt.z);

	ctx.save();
	ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
	ctx.strokeText(this.data.name + ':' + nt.z, nt.x, -nt.y);
	ctx.restore();
	//*/
	this.data.root.draw(ctx);
};


/**
 * Bone.
 * @author Hidetaka Sasai
 */
function Bone() {
	this.pt = {x:0, y:0, z:0};
}

Bone.prototype.prepare = function() {
	var t = this.translate;
	var mx = Matrix.rotateX(this.axis.x);
	var my = Matrix.rotateY(this.axis.y);
	var mz = Matrix.rotateZ(this.axis.z);
	var am = mz.multiply(my).multiply(mx);

	this.translateMatrix = new Matrix([[1,0,0,t.x],[0,1,0,t.y],[0,0,1,t.z],[0,0,0,1]]);
	if (this.parent) {
		var parent = this.parent;
		var rx = Matrix.rotateX(-parent.axis.x);
		var ry = Matrix.rotateY(-parent.axis.y);
		var rz = Matrix.rotateZ(-parent.axis.z);
		var pm = rx.multiply(ry).multiply(rz);

		this.axisMatrix = pm.multiply(am);
	} else {
		this.axisMatrix = am;
	}
	this.motionMatrix = Matrix.NO_EFFECT;
};

Bone.prototype.getAccum = function() {
	var order = this.skeleton.calcOrder;

	if (this.parent) {
		var mat;

		if (order == 0) {
			mat = this.axisMatrix.multiply(this.motionMatrix).multiply(this.translateMatrix);
		} else {
			mat = this.axisMatrix.multiply(this.translateMatrix).multiply(this.motionMatrix);
		}
		return this.parent.getAccum().multiply(mat);
	}
	return this.translateMatrix.multiply(this.motionMatrix);
};

Bone.prototype.calculate = function(isSimple) {
	this.pt = this.getAccum().affine(0, 0, 0);
	if (isSimple) {
		return;
	}
	this.joint.forEach(function(child) {
		child.calculate(false);
	});
};

Bone.prototype.conv = function(pt) {
	pt = this.skeleton.rotationMatrix.affine(pt.x, pt.y, pt.z);
	var pz = (pt.z + 2000) / 2000;
	var pmx = new Matrix([[pz,0,0,0],[0,pz,0,0],[0,0,pz,0],[0,0,0,1]]);

	return pmx.affine(pt.x, pt.y, pt.z);
};

Bone.prototype.drawLine = function(ctx) {
	var prevPt = this.conv(this.parent.pt);
	var nextPt = this.conv(this.pt);
	var scale = this.skeleton.scale;
	var nextX = nextPt.x * scale;
	var nextY = -nextPt.y * scale;
	var prevX = prevPt.x * scale;
	var prevY = -prevPt.y * scale;
	var dx = nextX - prevX;
	var dy = nextY - prevY;

	this.cx = prevX + dx / 2;
	this.cy = prevY + dy / 2;
	this.cz = nextPt.z;
	this.radian = Math.atan2(dy, dx);
	ctx.beginPath();
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(nextX, nextY);
	ctx.stroke();
};

Bone.prototype.draw = function(ctx) {
	this.calculate();
	if (this.parent) {
		this.drawLine(ctx);
	}
	this.joint.forEach(function(child) {
		child.draw(ctx);
	});
};
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
	this.scale = width / Field.WIDTH / 2;
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
/**
 * Repository.<br/>
 * 先読みをする貯蔵庫.
 * @author Hidetaka Sasai
 */
function Repository() {
	this.max = 0;
	this.loaded = 0;
	this.dic = {};
	this.type = 'json';
}

Repository.prototype.isComplete = function() {
	return 0 < this.max && this.max == this.loaded;
};

Repository.prototype.reserve = function(list) {
	var repository = this;

	list.forEach(function(key) {
		repository.load(key);
	});
};

Repository.prototype.makeName = function(key) {
	return key;
};

Repository.prototype.load = function(key) {
	var repository = this;
	var request = new XMLHttpRequest();
	var name = this.makeName(key);

	this.max++;
	request.open('GET', name, true);
	request.responseType = this.type;
	request.addEventListener('load', function() {
		var data = request.response;

		repository.dic[key] = data;
		repository.onload(key, name, data);
		repository.loaded++;
//		console.log('load:' + key);
	});
	request.send();
};

Repository.prototype.onload = function(key, name, data) {
	// サブクラスが実装する
};
/**
 * AudioMixer.
 */
'use strict';
function AudioMixer() {
	Repository.apply(this, arguments);
	this.type = 'arraybuffer';
	if (window.AudioContext || window.webkitAudioContext) {
		this.ctx = new (window.AudioContext || window.webkitAudioContext)();
		this.gainNode = this.ctx.createGain();
		this.panNode = this.ctx.createStereoPanner();
	}
	this.dic = [];
	this.bgm = null;
	this.source = null;
	this.lastTime = null;
}
AudioMixer.prototype = Object.create(Repository.prototype);
AudioMixer.INSTANCE = new AudioMixer();

AudioMixer.prototype.makeName = function(key) {
	return 'audio/' + key + '.mp3';
};

AudioMixer.prototype.onload = function(key, name, data) {
	var ctx = this.ctx;
	var dic = this.dic;

	ctx.decodeAudioData(data, function(buff) {
		dic[key] = buff;
	});
};

AudioMixer.prototype.play = function(key) {
	if (!this.dic[key]) {
		return;
	}
	var mixer = this;
	var len = arguments.length;
	var volume = 1 < len ? arguments[1] : 1;
	var isBgm = 2 < len ? arguments[2] : false;
	var pan = 3 < len ? arguments[3] : 0;
	var buff = this.dic[key];
	var source = this.ctx.createBufferSource();

	if (isBgm) {
		this.stop();
console.log('d:' + buff.duration);
		source.loopEnd = buff.duration + 10;
		source.loop = false;
		this.bgm = this.gainNode;
	}
	this.gainNode.gain.value = volume;
	this.gainNode.connect(this.ctx.destination);
	this.panNode.pan.value = pan;
	this.panNode.connect(this.gainNode);
	source.buffer = buff;
	source.connect(this.panNode);
	source.start(0);
	source.onended  = function() {
		mixer.lastTime = null;
	}
	this.source = source;
	this.lastTime = this.ctx.currentTime;
};

AudioMixer.prototype.fade = function() {
	if (this.bgm == null) {
		return;
	}
	var mixer = this;
	var gain = this.bgm.gain;
	var val = gain.value;
	var fading = function() {
		if (Math.floor(val * 100) == 0) {
			mixer.source.stop();
			return;
		}
		val *= .8;
		gain.value = val;
		setTimeout(fading, 100);
	};
	fading();
};

AudioMixer.prototype.stop = function() {
	if (this.bgm == null) {
		return;
	}
	this.bgm.disconnect();
	this.bgm = null;
};

AudioMixer.prototype.getCurrentTime = function() {
	if (!this.lastTime) {
		return null;
	}
	return this.ctx.currentTime - this.lastTime;
};

AudioMixer.prototype.setCurrentTime = function(time) {
	if (this.source) {
		this.lastTime = time;
	}
};
/**
 * Mocap player main.
 */
document.addEventListener('DOMContentLoaded', function() {
	var view = $('#view');
	var slider = $('#slider');
	var field = new Field();
	var cx = 0;
	var cy = 0;
	var which = 0;
	var onResize = function() {
		var body = $('body');
		var header = $('#header');
		var footer = $('#footer');
		var width = body.width();
		var height = body.height() - header.outerHeight(true) - footer.outerHeight(true) - 16;

		if (height / 9 < width / 16) {
			width = parseInt(height / 9 * 16);
		} else {
			height = parseInt(width / 16 * 9);
		}
		field.resetCanvas(width, height);
//		console.log('header:' + header.outerHeight());
//		console.log('footer:' + footer.outerHeight());
//		console.log('body:' + body.height());
//		console.log('body:' + body.innerHeight());
	}
	var start = function(e) {
		var isMouse = e.type.match(/^mouse/);

		if (isMouse) {
			cx = e.pageX;
			cy = e.pageY;
		} else if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			cx = touches.pageX;
			cy = touches.pageY;
		}
		which = e.which;
	};
	var touch = function(e) {
		var isMouse = e.type.match(/^mouse/);
		var tx;
		var ty;

		if (isMouse) {
//console.log('which:' + which);
			if (!which) {
				return;
			}
			tx = e.pageX;
			ty = e.pageY;
		} else if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			tx = touches.pageX;
			ty = touches.pageY;
		}
		var diffH = cx - tx;
		var diffV = cy - ty;

		field.rotateH(diffH);
		field.rotateV(diffV);
		cx = tx;
		cy = ty;
	};
	var end = function(e) {
//console.log('end');
		which = 0;
	};
	var activate = function() {
		var time = AudioMixer.INSTANCE.getCurrentTime();

		if (time) {
			var frame = parseInt(time / 0.025);
//console.log('f:' + frame);
			field.shiftMotion(frame);
			slider.val(frame);
			slider.slider('refresh');
		}
		field.draw();
		setTimeout(activate, 33);
	};

	setupFileList(field);
	view.mousedown(start);
	view.mousemove(touch);
	view.mouseleave(end);
	view.mouseup(end);
	view.bind('touchstart', start);
	view.bind('touchmove', touch);
	view.bind('touchend', end);
	slider.change(function() {
		var frame = $(this).val();
		var time = frame * 0.025;

		field.shiftMotion(frame);
		AudioMixer.INSTANCE.setCurrentTime(time);
	});
	$(window).resize(onResize);
	activate();
	$(window).resize();
	//
	$('#playButton').click(function() {
		var time = AudioMixer.INSTANCE.getCurrentTime();

		if (time) {
			AudioMixer.INSTANCE.fade();
			return;
		}
		AudioMixer.INSTANCE.play('Perfume_globalsite_sound', 1, true);
	});
	AudioMixer.INSTANCE.reserve([
		'Perfume_globalsite_sound',
	]);
});

function setupFileList(field) {
	var ul = $('#searchPanel ul');
	var list = [
		'aachan.bvh', 'kashiyuka.bvh', 'nocchi.bvh',
		'01_01.amc', '07_05.amc', '09_06.amc', '79_96.amc', '111_7.amc', '131_04.amc', '135_06.amc',
	];

	list.forEach(function(name) {
		var anchor = $('<a></a>').text(name);
		var li = $('<li></li>').append(anchor);

		li.attr('data-filtertext', name);
		ul.append(li);
		anchor.click(function() {
			field.loadMotion(name + '.json');
		});
	});
	ul.filterable('refresh');
}
