/**
 * AudioMixer.
 */
'use strict';
function AudioMixer() {
	if (window.AudioContext || window.webkitAudioContext) {
		this.ctx = new (window.AudioContext || window.webkitAudioContext)();
	}
	this.max = 0;
	this.loaded = 0;
	this.dic = [];
	this.bgm = null;
}
AudioMixer.INSTANCE = new AudioMixer();

AudioMixer.prototype.isComplete = function() {
	return 0 < this.max && this.max == this.loaded;
};

AudioMixer.prototype.add = function(key) {
	var mixer = this;
	var ctx = this.ctx;
	var dic = this.dic;
	var request = new XMLHttpRequest();
	var audioSrc = 'audio/' + key + '.mp3';

	this.max++;
	request.open('GET', audioSrc, true);
	request.responseType = 'arraybuffer';
	request.addEventListener('load', function() {
		if (!ctx) {
			var audio = new Audio();

			audio.src = audioSrc;
			dic[key] = audio;
			mixer.loaded++;
			return;
		}
		var audioData = request.response;

		ctx.decodeAudioData(audioData, function(buff) {
			dic[key] = buff;
			mixer.loaded++;
		});
	});
	request.send();
};

AudioMixer.prototype.addAll = function(keys) {
	var mixer = this;

	keys.forEach(function(key) {
		mixer.add(key);
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
