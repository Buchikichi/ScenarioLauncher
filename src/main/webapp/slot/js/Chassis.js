/**
 * Chassis.
 */
function Chassis() {
	this.reelList = [];
	this.coins = 1000;
	this.win = 0;
	this.wait = 0;
	this.sfx = new Audio();
	this.sfx.src = 'audio/sfx-slot.mp3';
	this.sfx.volume = .4;
}
Chassis.prototype.IS_DEBUG = false;

Chassis.prototype.setup = function(reelSet) {
	var bg = $('#bg');
	var reelList = [];

	// initial setting
	reelSet.forEach(function(pattern) {
		var ix = reelList.length;
		var reel = new Reel(ix, pattern);

		bg.append(reel.element);
		reelList.push(reel);
	});
	this.reelSet = reelSet;
	this.reelList = reelList;
	if (this.IS_DEBUG) {
		this.setupDebug();
		this.showDebug();
	}
};

Chassis.prototype.setupDebug = function() {
	var debug = $('<div></div>').attr('id', 'debug');

	this.reelList.forEach(function(reel) {
		var col = $('<div></div>');

		reel.pattern.forEach(function() {
			var row = $('<div></div>').append($('<span></span>'));

			col.append(row);
		});
		debug.append(col);
	});
	$('#bg').append(debug);
};

Chassis.prototype.showDebug = function() {
	$('#debug span').removeClass('selected');
	this.reelList.forEach(function(reel) {
		var col = $('#debug > div:eq(' + reel.ix + ')');
		var mark = (reel.mark + 1) % 21;
		var span = col.find('span:eq(' + mark + ')');

		span.addClass('selected');
	});
};

Chassis.prototype.start = function() {
	if (this.coins < 3) {
		return;
	}
	this.reelList.forEach(function(reel) {
		reel.start();
	});
	this.sfx.play();
	this.coins -= 3;
	this.showCoin();
};

Chassis.prototype.isStop = function() {
	var result = 0;

	this.reelList.forEach(function(reel) {
		result += reel.status;
	});
	return result == 0;
};

Chassis.prototype.isJudge = function() {
	var isJudge = true;

	this.reelList.forEach(function(reel) {
		if (!reel.isJudge()) {
			isJudge = false;
		}
	});
	return isJudge;
};

Chassis.prototype.judge = function() {
	if (!this.isJudge()) {
		return;
	}
	if (this.IS_DEBUG) {
		this.showDebug();
	}
	this.reelList.forEach(function(reel) {
		reel.status = 0;
	});
	var win = 0;
	win += this.sameFace([0, 0, 0]); // 上
	win += this.sameFace([1, 1, 1]); // 中
	win += this.sameFace([2, 2, 2]); // 下
	win += this.sameFace([0, 1, 2]); // ななめ
	win += this.sameFace([2, 1, 0]); // ななめ
	if (0 < win) {
		this.win = win;
	}
};

Chassis.prototype.sameFace = function(indices) {
	var result = 0;
	var reelSet = this.reelSet;
	var values = [];

	this.reelList.forEach(function(reel) {
		var ix = indices[reel.ix];
		var val = reel.pattern[(reel.mark + ix) % 21];

		values.push(val);
	});
	var basis = values[0];
	if (basis == values[1] && basis == values[2]) {
		if (basis == 2) {
			result = 30;
		} else if (basis == 7) {
			result = 100;
		} else {
			result = 10;
		}
	}
	return result;
};

Chassis.prototype.showCoin = function() {
	$('#coin').text(this.coins);
};

Chassis.prototype.drawCoin = function() {
	if (this.win == 0) {
		return;
	}
	if (0 < this.wait) {
		this.wait--;
		return;
	}
	var sfxWin = new Audio();
	sfxWin.src = 'audio/sfx-coin.mp3';
	sfxWin.volume = .4;
	sfxWin.play();

	if (5 < this.win) {
		this.coins += 5;
		this.win -= 5;
	} else {
		this.coins++;
		this.win--;
	}
	this.showCoin();
	if (this.win == 0) {
		var coinPanel = $('#coin');

		coinPanel.hide();
		coinPanel.show('fast');
		return;
	}
	this.wait = 1;
};

Chassis.prototype.draw = function() {
	this.reelList.forEach(function(reel) {
		reel.draw();
	});
	this.drawCoin();
};
