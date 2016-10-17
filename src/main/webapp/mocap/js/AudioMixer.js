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
