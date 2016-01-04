/**
 * Field.
 */
function Field(width, height) {
	this.width = width;
	this.height = height;
	this.actorList = [];
	this.shotList = [];
	this.hill = new Hill(this);
	this.nach = new Nach(this, 30, 100);
	this.nach.isGone = true;
	this.score = 0;
	this.hiscore = 0;
}

Field.prototype.MAX_ENEMIES = 100;
Field.prototype.MIN_LOOSING_RATE = 10;

Field.prototype.setup = function() {
	var view = $('#view');

	for (var ix = 0; ix < 3; ix++) {
		var bg = $('<div></div>').attr('id', 'bg' + ix).addClass('bg');

		bg.prop('mX', 0);
		bg.prop('mY', 0);
		view.append(bg);
	}
	this.setupCanvas(view);
	this.setupBgm(1);
	this.reset();
};

Field.prototype.setupCanvas = function(view) {
	// canvas
	var canvas = $('<canvas id="canvas"></canvas>').attr('width', this.width).attr('height', this.height);

	view.append(canvas);
	this.ctx = canvas.get(0).getContext('2d');
};

Field.prototype.setupBgm = function(stage) {
	this.bgm = new Audio();
	this.bgm.src = 'audio/nyanko-m.mp3';
	this.bgm.volume = .7;
	$(this.bgm).on('ended', function() {
		this.play();
	});
};

Field.prototype.setupEnemy = function() {
	if (this.isGameOver() && 10 < this.actorList.length) {
		return;
	}
	if (this.MAX_ENEMIES < this.actorList.length) {
		return;
	}
//	var type = parseInt(Math.random() * 10);
//	var x = this.width - 16;
//	var y = Math.random() * 125 + 25;
//
//	if (type == 0) {
//		this.actorList.push(new EnmHanker(this, x, y));
//	} else if (type < 3) {
//		this.actorList.push(new EnmBouncer(this, x, y));
//	} else {
//		this.actorList.push(new EnmWaver(this, x, y));
//	}
};

Field.prototype.reset = function() {
	$('.bg').each(function(ix, obj) {
		var bg = $(this);

		bg.prop('mX', 0);
		bg.prop('mY', 0);
	});
	this.nach.x = 30;
	this.nach.y = 100;
	this.actorList = [];
	this.loosingRate = 500;
	this.score = 0;
	this.showScore();
};

Field.prototype.startGame = function() {
	$('#gameOver').hide();
	this.bgm.currentTime = 0;
//	this.bgm.play();
	this.nach.entry();
	this.reset();
};

Field.prototype.endGame = function() {
	$('#gameOver').show('slow');
	this.bgm.pause();
};

Field.prototype.isGameOver = function() {
	return $('#gameOver').is(':visible');
};

Field.prototype.inkey = function(keys) {
	if (this.isGameOver()) {
		if (keys['k32']) {
			this.startGame();
		}
		return;
	}
	if (!this.nach.explosion) {
		var dx = 0;
	
		if (keys['k16'] || keys['k17'] || keys['k38']) {
			this.nach.jump();
		} else {
			this.nach.letdown();
		}
		if (keys['k37']) {
			dx = -1;
		}
		if (keys['k39']) {
			dx = 1;
		}
		this.nach.dx = dx;
	}
	this.nach.move();
};

Field.prototype.scroll = function() {
	var speed = this.nach.getSpeed() * .45;

	$('.bg').each(function(ix, obj) {
		var bg = $(this);
		var mX = bg.prop('mX');
		var mY = bg.prop('mY');
		var position = -mX + 'px ' + -mY + 'px';

		bg.css('background-position', position);
		mX += (ix + 1) * speed;
		bg.prop('mX', mX);
		bg.prop('mY', mY);
	});
	if (die(this.loosingRate / 10)) {
		this.setupEnemy();
	}
	if (this.MIN_LOOSING_RATE < this.loosingRate) {
		this.loosingRate -= .1;
	}
};

Field.prototype.draw = function() {
	var field = this;
	var ctx = this.ctx;
	var nach = this.nach;
	var shotList = [];
	var validActors = [];
	var enemyList = [];
	var score = 0;
	var speed = nach.getSpeed();

	score += parseInt(speed * .1) * 10;
	ctx.clearRect(0, 0, this.width, this.height);
	this.hill.draw(ctx);
	this.hill.move(speed);
	$.each(this.actorList, function(ix, actor) {
		if (actor.isGone) {
			return;
		}
		actor.draw(ctx);
		actor.move(nach);
		validActors.push(actor);
		if (actor instanceof Shot) {
			shotList.push(actor);
		} else if (actor instanceof Bullet) {
			nach.isHit(actor);
		} else if (actor instanceof Enemy) {
			nach.isHit(actor);
			enemyList.push(actor);
			if (100 < actor.calcDistance(nach)) {
				if (die(field.loosingRate)) {
					var bullet = new Bullet(field, actor.x, actor.y);
					bullet.aim(nach);
					validActors.push(bullet);
				}
			}
		}
	});
	var ground = this.hill.calcHeight(this.nach/*, ctx*/);
	this.nach.land(ground);
	this.nach.draw(ctx);
	this.actorList = validActors;
	this.shotList = shotList;
	$.each(enemyList, function(ix, enemy) {
		$.each(shotList, function(vx, shot) {
			if (enemy.isHit(shot)) {
				if (enemy.explosion) {
					score += enemy.score;
				}
			}
		});
	});
	this.score += score;
//	if (0 < score) {
		this.showScore();
//	}
	if (!this.isGameOver() && nach.isGone) {
		this.endGame();
	}
};

Field.prototype.showScore = function() {
	var speed = parseInt(this.nach.getSpeed());

	if (this.hiscore < this.score) {
		this.hiscore = this.score;
	}
	$('#score > div > div:eq(1)').text(this.score);
	$('#score > div:eq(1) > div:eq(1)').text(this.hiscore);
	$('#score > div:eq(2)').text(this.nach.jumping + '/' + speed);
};
