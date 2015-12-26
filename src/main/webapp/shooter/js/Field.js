/**
 * Field.
 */
function Field(width, height) {
	this.width = width;
	this.height = height;
	this.enemyList = [];
	this.maxShots = 7;
	this.shotList = [];
	this.ship = new Ship(this, 100, 100);
	this.ship.isGone = true;
	this.score = 0;
	this.hiscore = 0;
}

Field.prototype.MAX_ENEMIES = 100;

Field.prototype.setup = function() {
	var view = $('#view');

	for (var ix = 0; ix < 3; ix++) {
		var bg = $('<div></div>').attr('id', 'bg' + ix).addClass('bg');

		bg.prop('mX', 0);
		bg.prop('mY', 0);
		view.append(bg);
	}
	this.setupCanvas(view);
	this.setupEnemy();
	this.setupBgm(1);
};

Field.prototype.setupCanvas = function(view) {
	// canvas
	var canvas = $('<canvas id="canvas"></canvas>').attr('width', this.width).attr('height', this.height);

	view.append(canvas);
	this.ctx = canvas.get(0).getContext('2d');
};

Field.prototype.setupBgm = function(stage) {
	this.bgm = new Audio();
	this.bgm.src = 'audio/bgm-edo-beth.mp3';
	this.bgm.volume = .7;
	$(this.bgm).on('ended', function() {
		this.play();
	});
};

Field.prototype.setupEnemy = function() {
	var type = parseInt(Math.random() * 10);
	var x = this.width - 16;
	var y = Math.random() * 125 + 25;

	if (type == 0) {
		this.enemyList.push(new EnmHanker(x, y, type));
	} else if (type < 3) {
		this.enemyList.push(new EnmBouncer(x, y, type));
	} else {
		this.enemyList.push(new EnmWaver(x, y, type));
	}
};

Field.prototype.reset = function() {
	$('.bg').each(function(ix, obj) {
		var bg = $(this);

		bg.prop('mX', 0);
		bg.prop('mY', 0);
	});
	this.ship.x = 100;
	this.ship.y = 100;
	this.enemyList = [];
	this.score = 0;
};

Field.prototype.startGame = function() {
	$('#gameOver').hide();
	this.bgm.currentTime = 0;
	this.bgm.play();
	this.ship.entry();
	this.reset();
};

Field.prototype.endGame = function() {
	if ($('#gameOver').is(':visible')) {
		return;
	}
	$('#gameOver').show('slow');
	this.bgm.pause();
};

Field.prototype.inkey = function(keys) {
	if (this.ship.isGone) {
		if (keys['k32']) {
			this.startGame();
		}
		return;
	}
	var dx = 0;
	var dy = 0;

	if (keys['k17']) {
		if (this.shotList.length < this.maxShots) {
			var x = this.ship.x + 16;
			var y = this.ship.y + 8;
			this.shotList.push(new Shot(this, x, y));
		}
	}
	if (keys['k37']) {
		dx = -1;
	}
	if (keys['k38']) {
		dy = -1;
	}
	if (keys['k39']) {
		dx = 1;
	}
	if (keys['k40']) {
		dy = 1;
	}
	this.ship.dx = dx;
	this.ship.dy = dy;
	this.ship.move();
};

Field.prototype.scroll = function() {
	$('.bg').each(function(ix, obj) {
		var bg = $(this);
		var mX = bg.prop('mX');
		var mY = bg.prop('mY');
		var position = -mX + 'px ' + -mY + 'px';

		bg.css('background-position', position);
		mX += (ix + 1) * .5;
		bg.prop('mX', mX);
		bg.prop('mY', mY);
	});
	if (parseInt(Math.random() * 30) == 0) {
		this.setupEnemy();
	}
};

Field.prototype.draw = function() {
	var ctx = this.ctx;
	var ship = this.ship;
	var validShots = [];
	var validEnemies = [];

	ctx.clearRect(0, 0, this.width, this.height);
	$.each(this.shotList, function(ix, shot) {
		shot.draw(ctx);
		if (!shot.isOut()) {
			validShots.push(shot);
		}
	});
	this.ship.draw(ctx);
	this.shotList = validShots;
	validShots = [];

	var shotList = this.shotList;
	$.each(this.enemyList, function(ix, enemy) {
		enemy.draw(ctx);
		enemy.move(ship);
		$.each(shotList, function(vx, shot) {
			if (enemy.isHit(shot)) {
				shot.fate();
			}
		});
		if (!enemy.isGone()) {
			ship.isHit(enemy);
			validEnemies.push(enemy);
		}
	});
	this.enemyList = validEnemies;
	if (ship.isGone) {
		this.endGame();
	}
};
