/**
 * Field.
 */
function Field(width, height) {
	this.width = width;
	this.height = height;
	this.hW = width / 2;
	this.hH = height / 2;
	this.actorList = [];
	this.shotList = [];
	this.ship = new Ship(this, 100, 100);
	this.ship.isGone = true;
	this.shipTarget = null;
	this.score = 0;
	this.hiscore = 0;
	this.enemyCycle = 0;
}

Field.MAX_SHOTS = 9;
Field.MAX_ENEMIES = 100;
Field.ENEMY_CYCLE = 10;
Field.MIN_LOOSING_RATE = 1;
Field.MAX_LOOSING_RATE = 100;

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
	this.bgm.src = 'audio/bgm-edo-beth.mp3';
	this.bgm.volume = .7;
	$(this.bgm).on('ended', function() {
		this.play();
	});
};

Field.prototype.setupEnemy = function() {
	if (this.isGameOver() && 10 < this.actorList.length) {
		return;
	}
	if (Field.MAX_ENEMIES < this.actorList.length) {
		return;
	}
	var type = parseInt(Math.random() * 100);
	var x = this.width;
	var y = Math.random() * 125 + 25;
	var istenEacleExists = false;
	var isDragonExists = false;

	this.actorList.forEach(function(actor) {
		if (actor instanceof EnmTentacle) {
			istenEacleExists = true;
		}
		if (actor instanceof EnmDragonHead) {
			isDragonExists = true;
		}
	});
	if (type < 3) {
		if (!isDragonExists) {
			this.setupDragon(x, y);
		}
	} else if (type < 7/* && !istenEacleExists*/) {
		var tentacle = new EnmTentacle(this, x, y);
		var joint = tentacle.next;

		while (joint) {
			this.actorList.push(joint);
			joint = joint.next;
		}
		this.actorList.push(tentacle);
	} else if (type < 15) {
		this.actorList.push(new EnmHanker(this, x, y));
	} else if (type < 30) {
		var y = Math.random() * (this.hH - 32) + this.hH;
		this.actorList.push(new EnmBouncer(this, x, y));
	} else {
		this.actorList.push(new EnmWaver(this, x, y));
	}
};

Field.prototype.setupDragon = function(x, y) {
	var dragon = new EnmDragonHead(this, x + 50, y);
	var actorList = this.actorList;

	dragon.body.forEach(function(body) {
		actorList.push(body);
	});
	this.actorList.push(dragon);
};

Field.prototype.reset = function() {
	$('.bg').each(function(ix, obj) {
		var bg = $(this);

		bg.prop('mX', 0);
		bg.prop('mY', 0);
	});
	this.ship.x = 100;
	this.ship.y = 100;
	this.actorList = [];
	this.loosingRate = Field.MAX_LOOSING_RATE;
	this.score = 0;
	this.showScore();
};

Field.prototype.startGame = function() {
	$('#gameOver').hide();
	this.bgm.currentTime = 0;
	this.bgm.play();
	this.ship.enter();
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
	this.ship.dir = null;
	if (this.isGameOver()) {
		if (keys['k32']) {
			this.startGame();
		}
		return;
	}
	if (!this.ship.explosion) {
		if (keys['k16'] || keys['k17']) {
			this.ship.trigger = true;
		}
		this.ship.aim(this.shipTarget);
		this.ship.inkey(keys);
	}
	this.ship.move();
};

Field.prototype.moveShipTo = function(target) {
	if (this.isGameOver() || this.ship.explosion) {
		return;
	}
	if (target) {
		this.ship.trigger = true;
	}
	this.shipTarget = target;
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
	if (Field.ENEMY_CYCLE < this.enemyCycle++) {
		this.enemyCycle = 0;
		if (die(this.loosingRate / 30)) {
			this.setupEnemy();
		}
	}
	if (Field.MIN_LOOSING_RATE < this.loosingRate) {
		var step = this.loosingRate / 10000;

		this.loosingRate -= step;
	}
};

Field.prototype.draw = function() {
	var field = this;
	var ctx = this.ctx;
	var ship = this.ship;
	var shotList = [];
	var validActors = [];
	var enemyList = [];
	var score = 0;

	ctx.clearRect(0, 0, this.width, this.height);
	this.actorList.forEach(function(actor) {
		if (actor.isGone) {
			return;
		}
		actor.draw(ctx);
		actor.move(ship);
		validActors.push(actor);
		if (actor instanceof Shot) {
			shotList.push(actor);
		} else if (actor instanceof Bullet) {
			ship.isHit(actor);
		} else if (actor instanceof Enemy) {
			ship.isHit(actor);
			enemyList.push(actor);
			if (actor.trigger() && 100 < actor.calcDistance(ship)) {
				if (die(field.loosingRate / 10)) {
					var bullet = new Bullet(field, actor.x, actor.y);
					bullet.aim(ship);
					validActors.push(bullet);
				}
			}
		}
	});
	this.ship.draw(ctx);
	this.actorList = validActors;
	this.shotList = shotList;
	enemyList.forEach(function(enemy) {
		shotList.forEach(function(shot) {
			if (enemy.isHit(shot)) {
				if (enemy.explosion) {
					score += enemy.score;
				}
			}
		});
	});
	if (this.ship.trigger) {
		this.ship.trigger = false;
		if (this.shotList.length < Field.MAX_SHOTS) {
			this.actorList.push(this.ship.shot());
		}
	}
	this.score += score;
	this.showScore();
	if (!this.isGameOver() && ship.isGone) {
		this.endGame();
	}
};

Field.prototype.showScore = function() {
	if (this.hiscore < this.score) {
		this.hiscore = this.score;
	}
	$('#score > div > div:eq(1)').text(this.score);
	$('#score > div:eq(1) > div:eq(1)').text(this.hiscore);
//	$('#score > div:eq(2)').text(this.actorList.length + ':' + parseInt(this.loosingRate));
};
