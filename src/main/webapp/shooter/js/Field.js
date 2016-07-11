/**
 * Field.
 */
function Field() {
	this.width = Field.WIDTH;
	this.height = Field.HEIGHT;
	this.hW = this.width / 2;
	this.hH = this.height / 2;
	this.ship = new Ship(this, -100, 100);
	this.ship.isGone = true;
	this.shipTarget = null;
	this.shipRemain = 0;
	this.actorList = [];
	this.score = 0;
	this.hiscore = 0;
	this.enemyCycle = 0;
	this.stage = 0;
	this.setup();
}

Field.WIDTH = 512;
Field.HEIGHT = 224;
Field.MAX_ENEMIES = 100;
Field.ENEMY_CYCLE = 10;
Field.MIN_LOOSING_RATE = 1;
Field.MAX_LOOSING_RATE = 100;
Field.MAX_SHIP = 3;
Field.MAX_HIBERNATE = Actor.MAX_EXPLOSION * 5;

Field.prototype.setup = function() {
	var view = $('#view');
	var canvas = document.getElementById('canvas');

	this.landform = new Landform(canvas);
	for (var ix = 0; ix < 2; ix++) {
		var bg = $('<div></div>').attr('id', 'bg' + ix).addClass('bg');

		bg.prop('mX', 0);
		bg.prop('mY', 0);
		view.append(bg);
	}
	canvas.width = this.width;
	canvas.height = this.height;
	this.ctx = canvas.getContext('2d');
	this.bgm = new Audio();
	this.bgm.volume = .7;
	$(this.bgm).on('ended', function() {
		this.play();
	});
};

Field.prototype.nextStage = function() {
	var stage = Stage.LIST[this.stage];

	this.landform.speed = stage.speed;
	this.landform.load('./img/' + stage.img);
	this.landform.loadMapData('./img/' + stage.map);
	this.bgm.src = 'audio/' + stage.bgm;
	this.bgm.currentTime = 0;
	this.bgm.play();
	this.stage++;
	if (Stage.LIST.length <= this.stage) {
		this.stage = 0;
	}
};

Field.prototype.setupEnemy = function() {
	if (this.isGameOver()) {
		return;
	}
	if (Field.MAX_ENEMIES < this.actorList.length) {
		return;
	}
	var type = parseInt(Math.random() * 100);
	var x = Field.WIDTH;
	var y = Math.random() * 125 + 25;
	var numOfTentacle = 0;
	var numOfDragon = 0;

	this.actorList.forEach(function(actor) {
		if (actor instanceof EnmTentacle) {
			numOfTentacle++;
		}
		if (actor instanceof EnmDragonHead) {
			numOfDragon++;
		}
	});
	if (type < 3 && numOfTentacle < 3) {
		this.actorList.push(new EnmTentacle(this, x, y));
	} else if (type < 10) {
		this.actorList.push(new EnmJuno(this, x, y));
	} else if (type < 15) {
		this.actorList.push(new EnmHanker(this, x, y));
	} else if (type < 20) {
		var y = Math.random() * (this.hH - 32) + this.hH;
		this.actorList.push(new EnmBouncer(this, x, y));
	} else if (type < 25) {
		var y = Math.random() * this.hH + this.hH / 2;
		this.actorList.push(new EnmJerky(this, x, y));
//		this.actorList.push(new EnmFormation(this, x, y).setup(EnmWaver, 8));
	}
};

Field.prototype.reset = function() {
	$('.bg').each(function(ix, obj) {
		var bg = $(this);

		bg.prop('mX', 0);
		bg.prop('mY', 0);
	});
	this.landform.reset();
	this.ship.x = 100;
	this.ship.y = 100;
	this.ship.trigger = false;
	this.ship.enter();
	this.actorList = [this.ship];
	this.hibernate = Field.MAX_HIBERNATE;
	this.bgm.currentTime = 0;
	this.bgm.play();
};

Field.prototype.startGame = function() {
	$('#gameOver').hide();
	this.loosingRate = Field.MAX_LOOSING_RATE;
	this.score = 0;
	this.shipRemain = Field.MAX_SHIP;
	this.stage = 0;
	this.nextStage();
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
	var field = this;

	$('.bg').each(function(ix, obj) {
		var bg = $(this);
		var mX = bg.prop('mX');
		var mY = bg.prop('mY');
		var position = -mX + 'px ' + -mY + 'px';

		bg.css('background-position', position);
		mX += (ix + 1) * .4;
		bg.prop('mX', mX);
		bg.prop('mY', mY);
	});
	if (!this.landform.forward()) {
		if (!this.isGameOver()) {
			this.nextStage();
		}
	}
	this.landform.scanEnemy().forEach(function(obj) {
		var enemy;

		if (obj.formation) {
			enemy = new EnmFormation(field, obj.x, obj.y).setup(obj.type, 8);
		} else {
			enemy = new obj.type(field, obj.x, obj.y);
		}
		field.actorList.push(enemy);
	});
//	if (Field.ENEMY_CYCLE < this.enemyCycle++) {
//		this.enemyCycle = 0;
//		if (die(this.loosingRate / 30)) {
//			this.setupEnemy();
//		}
//	}
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
	var enemyList = [];
	var validActors = [];
	var score = 0;

	ctx.clearRect(0, 0, this.width, this.height);
	this.actorList.forEach(function(actor) {
		if (actor.isGone) {
			return;
		}
		actor.constraint = !die(field.loosingRate / 10);
		field.landform.hitTest(actor);
		var child = actor.move(ship);

		if (child instanceof Actor) {
			validActors.push(child);
		}
		if (child instanceof Array) {
			child.forEach(function(enemy) {
				validActors.push(enemy);
			});
		}
		actor.draw(ctx);
		validActors.push(actor);
		if (actor instanceof Shot) {
			shotList.push(actor);
		} else if (actor instanceof Bullet) {
			ship.isHit(actor);
		} else if (actor instanceof Enemy) {
			ship.isHit(actor);
			enemyList.push(actor);
		}
		if (actor.explosion && actor.score) {
			score += actor.score;
			actor.score = 0;
		}
	});
	shotList.forEach(function(shot) {
		enemyList.forEach(function(enemy) {
			enemy.isHit(shot);
		});
	});
	this.actorList = validActors;
	this.ship.shotList = shotList;
	this.landform.draw();
	this.score += score;
	this.showScore();
	if (!this.isGameOver() && ship.isGone) {
		this.bgm.pause();
		if (0 < --this.hibernate) {
			return;
		}
		if (0 < --this.shipRemain) {
			this.reset();
		} else {
			this.endGame();
		}
	}
};

Field.prototype.showScore = function() {
	if (this.hiscore < this.score) {
		this.hiscore = this.score;
	}
	$('#score > div > div:eq(1)').text(this.score);
	$('#score > div:eq(1) > div:eq(1)').text(this.hiscore);
//	$('#score > div:eq(2)').text(this.actorList.length + ':' + parseInt(this.loosingRate));
	$('#remain > div > div:eq(0)').width(this.shipRemain * 16);
};
