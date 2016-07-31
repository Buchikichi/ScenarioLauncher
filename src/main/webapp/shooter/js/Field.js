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
Field.MAX_LOOSING_RATE = 200;
Field.MAX_SHIP = 3;
Field.MAX_HIBERNATE = Actor.MAX_EXPLOSION * 5;
Field.PHASE = {
	NORMAL: 0,
	BOSS: 1
};

Field.prototype.setup = function() {
	var canvas = document.getElementById('canvas');

	canvas.width = this.width;
	canvas.height = this.height;
	this.ctx = canvas.getContext('2d');
	this.landform = new Landform(canvas);
};

Field.prototype.nextStage = function() {
	var stage = Stage.LIST[this.stageNum];

	this.stage = stage;
	this.landform.loadStage(stage);
	this.stageNum++;
	if (Stage.LIST.length <= this.stageNum) {
		this.stageNum = 0;
	}
	AudioMixer.INSTANCE.play(this.stage.bgm, .7, true);
};

Field.prototype.reset = function() {
	this.phase = Field.PHASE.NORMAL;
	this.landform.reset();
	this.ship.x = 100;
	this.ship.y = 100;
	this.ship.trigger = false;
	this.ship.shotList = [];
	this.ship.enter();
	this.actorList = [this.ship];
	this.hibernate = Field.MAX_HIBERNATE;
	AudioMixer.INSTANCE.play(this.stage.bgm, .7, true);
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
};

Field.prototype.isGameOver = function() {
	return $('#gameOver').is(':visible');
};

Field.prototype.inkey = function(keys) {
	this.ship.dir = null;
	if (this.isGameOver()) {
		if (keys[' ']) {
			this.startGame();
		}
		return;
	}
	if (!this.ship.explosion) {
		if (keys['Control'] || keys['Shift']) {
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
	var next = this.landform.forward(this.ship);

	if (this.isGameOver()) {
		return;
	}
	if (next == Landform.NEXT.NOTICE) {
		AudioMixer.INSTANCE.fade();
	} else if (next == Landform.NEXT.ARRIV && this.stage.boss) {
		this.phase = Field.PHASE.BOSS;
		AudioMixer.INSTANCE.play(this.stage.boss, .7, true);
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
		AudioMixer.INSTANCE.fade();
	}
	this.actorList = validActors;
	this.landform.draw();
	this.score += score;
	this.showScore();
	if (!this.isGameOver() && ship.isGone) {
		AudioMixer.INSTANCE.stop();
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
	var scoreNode = document.querySelector('#score > div > div:nth-child(2)');
	var hiscoreNode = document.querySelector('#score > div:nth-child(2) > div:nth-child(2)');
	var debugNode = document.querySelector('#score > div:nth-child(3)');
	var remainNode = document.querySelector('#remain > div > div:nth-child(1)');

	scoreNode.innerHTML = this.score;
	hiscoreNode.innerHTML = this.hiscore;
//	debugNode.innerHTML = this.actorList.length + ':' + parseInt(this.loosingRate);
	if (this.shipRemain) {
		remainNode.style.width = (this.shipRemain - 1) * 16 + 'px';
	}
};
