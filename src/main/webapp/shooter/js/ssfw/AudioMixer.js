/**
 * AudioMixer.
 */
'use strict';
function AudioMixer() {
	Repository.apply(this, arguments);
	this.type = 'arraybuffer';
	if (window.AudioContext || window.webkitAudioContext) {
		this.ctx = new (window.AudioContext || window.webkitAudioContext)();
	}
	this.dic = [];
	this.bgm = null;
}
AudioMixer.prototype = Object.create(Repository.prototype);
AudioMixer.INSTANCE = new AudioMixer();

AudioMixer.prototype.makeName = function(key) {
	return 'audio/' + key + '.mp3';
};

AudioMixer.prototype.onload = function(key, name, data) {
	var mixer = this;
	var ctx = this.ctx;
	var dic = this.dic;

	if (!ctx) {
		var audio = new Audio();

		audio.src = name;
		dic[key] = audio;
		this.done();
		return;
	}
	ctx.decodeAudioData(data, function(buff) {
		dic[key] = buff;
		mixer.done();
	});
};

AudioMixer.prototype.play = function(key) {
	if (!this.dic[key]) {
		return;
	}
	var len = arguments.length;
	var volume = 1 < len ? arguments[1] : 1;
	var isBgm = 2 < len ? arguments[2] : false;
	var pan = 3 < len ? arguments[3] : 0;

	if (!this.ctx) {
		var audio = this.dic[key];

		audio.pause();
		audio.currentTime = 0;
		audio.volume = volume;
		audio.loop = isBgm;
		audio.play();
		if (isBgm) {
			this.bgm = audio;
		}
		return;
	}
	var buff = this.dic[key];
	var source = this.ctx.createBufferSource();
	var gainNode = this.ctx.createGain();
	var panNode = this.ctx.createStereoPanner();

	if (isBgm) {
		this.stop();
		source.loopEnd = buff.duration - .05;
		source.loop = true;
		this.bgm = gainNode;
	}
	gainNode.gain.value = volume;
	gainNode.connect(this.ctx.destination);
	panNode.pan.value = pan;
	panNode.connect(gainNode);
	source.buffer = buff;
	source.connect(panNode);
	source.start(0);
};

AudioMixer.prototype.fade = function() {
	if (this.bgm == null) {
		return;
	}
	if (!this.ctx) {
		var audio = this.bgm;
		var val = audio.volume;

		var fading = function() {
			if (Math.floor(val * 100) == 0) {
				return;
			}
			val *= .95;
			audio.volume = val;
			setTimeout(fading, 1000);
		};
		fading();
		return;
	}
	var mixer = this;
	var gain = this.bgm.gain;
	var val = gain.value;
	var fading = function() {
		if (Math.floor(val * 100) == 0) {
			return;
		}
		val *= .9;
		gain.value = val;
		setTimeout(fading, 1000);
	};
	fading();
};

AudioMixer.prototype.stop = function() {
	if (this.bgm == null) {
		return;
	}
	if (!this.ctx) {
		this.bgm.pause();
		this.bgm = null;
		return;
	}
	this.bgm.disconnect();
	this.bgm = null;
};
