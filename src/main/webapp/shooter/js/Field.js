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
	this.stage = Stage.LIST[0];
	this.stageNum = 0;
	this.setup();
}

Field.WIDTH = 512;
Field.HEIGHT = 224;
Field.HALF_WIDTH = Field.WIDTH / 2;
Field.HALF_HEIGHT = Field.HEIGHT / 2;
Field.MAX_ENEMIES = 100;
Field.ENEMY_CYCLE = 10;
Field.MIN_LOOSING_RATE = 1;
Field.MAX_LOOSING_RATE = 100;
Field.MAX_SHIP = 3;
Field.MAX_HIBERNATE = Actor.MAX_EXPLOSION * 5;
Field.PHASE = {
	NORMAL: 0,
	BOSS: 1
};

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

Field.prototype.setBgm = function(bgm) {
	this.bgm.src = 'audio/' + bgm;
	this.bgm.currentTime = 0;
	this.bgm.play();
};

Field.prototype.nextStage = function() {
	var stage = Stage.LIST[this.stageNum];

	this.stage = stage;
	this.landform.reset();
	this.landform.speed = stage.speed;
	this.landform.scroll = stage.scroll;
	this.landform.load('./img/' + stage.img);
	this.landform.loadMapData('./img/' + stage.map);
	this.stageNum++;
	if (Stage.LIST.length <= this.stageNum) {
		this.stageNum = 0;
	}
	this.setBgm(this.stage.bgm);
};

Field.prototype.reset = function() {
	$('.bg').each(function(ix, obj) {
		var bg = $(this);

		bg.prop('mX', 0);
		bg.prop('mY', 0);
	});
	this.phase = Field.PHASE.NORMAL;
	this.landform.reset();
	this.ship.x = 100;
	this.ship.y = 100;
	this.ship.trigger = false;
	this.ship.enter();
	this.actorList = [this.ship];
	this.hibernate = Field.MAX_HIBERNATE;
	this.setBgm(this.stage.bgm);
this.hasCascade = false;
};

Field.prototype.startGame = function() {
	$('#gameOver').hide();
	this.loosingRate = Field.MAX_LOOSING_RATE;
	this.score = 0;
	this.shipRemain = Field.MAX_SHIP;
	this.stageNum = 0;
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
	if (this.phase == Field.PHASE.BOSS) {
		return;
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
//	if (!this.hasCascade) {
//		this.hasCascade = true;
//		this.actorList.push(new Cascade(field, 400, 20));
//	}
	var next = this.landform.forward(this.ship);

	if (this.isGameOver()) {
		return;
	}
	if (next == Landform.NEXT.ARRIV && this.stage.boss) {
console.log('boss!!');
		this.phase = Field.PHASE.BOSS;
		this.setBgm(this.stage.boss);
	} else if (next == Landform.NEXT.PAST) {
		this.nextStage();
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
	var enemyList = [];
	var validActors = [];
	var score = 0;

	ctx.clearRect(0, 0, this.width, this.height);
	this.actorList.forEach(function(actor) {
		if (actor.isGone) {
			return;
		}
		actor.constraint = !die(field.loosingRate / 10);
		var child = actor.move(ship);

		if (child instanceof Array) {
			child.forEach(function(enemy) {
				validActors.push(enemy);
			});
		}
		field.landform.effect(actor);
		field.landform.hitTest(actor);
		actor.draw(ctx);
		validActors.push(actor);
		if (actor instanceof Bullet) {
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
	this.ship.shotList.forEach(function(shot) {
		enemyList.forEach(function(enemy) {
			enemy.isHit(shot);
		});
	});
	if (this.phase == Field.PHASE.BOSS && enemyList.length == 0) {
		this.phase = Field.PHASE.NORMAL;
	}
	this.actorList = validActors;
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
	$('#remain > div > div:eq(0)').width((this.shipRemain - 1) * 16);
};
