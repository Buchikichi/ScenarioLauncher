/**
 * Field.
 */
class Field extends Matter {
	constructor(width, height) {
		super(0, 0);
		this.view = new FlexibleView(width, height);
		this.width = width;
		this.height = height;
		this.ship = new Ship(-100, 100);
		this.ship.isGone = true;
		this.shipRemain = 0;
		this.actorList = [];
		this.score = 0;
		this.hiscore = 0;
		this.enemyCycle = 0;
		this.stage = Stage.LIST[0];
		this.stageNum = 0;
		this.landform = new Landform(this.view.canvas);
		Field.Instance = this;
	}

	get ctx() {
		return this.view.ctx;
	}

	nextStage() {
		let stage = Stage.LIST[this.stageNum];

		this.stage = stage;
		this.landform.loadStage(stage);
		this.stageNum++;
		if (Stage.LIST.length <= this.stageNum) {
			this.stageNum = 0;
		}
	}

	_reset() {
		this.phase = Field.PHASE.NORMAL;
		this.ship.reset();
		this.ship.x = 100;
		this.ship.y = 100;
		this.ship.enter();
		this.actorList = [this.ship];
		this.hibernate = Field.MAX_HIBERNATE;
	}

	reset() {
		this.landform.reset();
		this._reset();
	}

	retry() {
		this.landform.retry();
		this._reset();
	}

	startGame() {
		this.loosingRate = Field.MAX_LOOSING_RATE;
		this.score = 0;
		this.shipRemain = Field.MAX_SHIP;
		this.stageNum = 0;
		this.nextStage();
		this._reset();
	}

	endGame() {
		let gameOver = document.getElementById('gameOver');

		gameOver.classList.remove('hidden');
	}

	isGameOver() {
		let gameOver = document.getElementById('gameOver');

		return !gameOver.classList.contains('hidden');
	}

	calcPan(x) {
		return (x - this.hW) / this.hW;
	}

	move() {
		if (this.phase == Field.PHASE.BOSS) {
			return;
		}
		this.landform.scanEnemy().forEach(obj=> {
			let enemy;

			if (obj.formation) {
				enemy = new Formation(obj.x, obj.y).setup(obj.type, 8);
			} else {
				enemy = new obj.type(obj.x, obj.y);
			}
			this.actorList.push(enemy);
		});
		let next = this.landform.forward(this.ship);

		if (this.isGameOver()) {
			return;
		}
		if (next == Landform.NEXT.NOTICE) {
			AudioMixer.INSTANCE.fade();
			this.stage.notice();
		} else if (next == Landform.NEXT.ARRIV) {
			this.phase = Field.PHASE.BOSS;
			this.stage.toBossMode();
		} else if (next == Landform.NEXT.PAST) {
			this.nextStage();
		}
		if (Field.MIN_LOOSING_RATE < this.loosingRate) {
			let step = this.loosingRate / 10000;

			this.loosingRate -= step;
		}
	}

	draw() {
		let field = this;
		let ctx = this.ctx;
		let ship = this.ship;
		let shotList = [];
		let enemyList = [];
		let validActors = [];
		let score = 0;

		this.view.clear();
//		ctx.clearRect(0, 0, this.width, this.height);
		this.landform.drawBg(ctx);
		this.actorList.sort(function(a, b) {
			return a.z - b.z;
		});
		this.actorList.forEach(actor => {
			if (actor.isGone) {
				return;
			}
			if (actor instanceof Bullet) {
				actor.isHit(ship);
			} else if (actor instanceof Enemy) {
				actor.triggered = parseInt(Math.random() * field.loosingRate / 10) == 0;
				actor.isHit(ship);
				enemyList.push(actor);
			} else if (actor instanceof Shot || actor instanceof Missile) {
				shotList.push(actor);
			}
			let child = actor.move(ship);

			if (child instanceof Array) {
				child.forEach(enemy => {
					validActors.push(enemy);
				});
			}
			field.landform.effect(actor);
			field.landform.hitTest(actor);
			actor.draw(ctx);
			validActors.push(actor);
			if (actor.explosion && actor.score) {
				score += actor.score;
				actor.score = 0;
			}
		});
		shotList.forEach(shot => {
			enemyList.forEach(enemy => enemy.isHit(shot));
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
				this.retry();
//++this.shipRemain;
			} else {
				this.endGame();
			}
		}
	}

	showScore() {
		if (this.hiscore < this.score) {
			this.hiscore = this.score;
		}
		let scoreNode = document.querySelector('#score > div > div:nth-child(2)');
		let hiscoreNode = document.querySelector('#score > div:nth-child(2) > div:nth-child(2)');
		let debugNode = document.querySelector('#score > div:nth-child(3)');
		let remainNode = document.querySelector('#remain > div > div:nth-child(1)');

		if (!scoreNode) {
			return;
		}
		scoreNode.innerHTML = this.score;
		hiscoreNode.innerHTML = this.hiscore;
//		debugNode.innerHTML = this.actorList.length + ':' + parseInt(this.loosingRate);
		if (this.shipRemain) {
			remainNode.style.width = (this.shipRemain - 1) * 16 + 'px';
		}
	}
}
Field.MAX_ENEMIES = 100;
Field.ENEMY_CYCLE = 10;
Field.MIN_LOOSING_RATE = 1;
Field.MAX_LOOSING_RATE = 20000;
Field.MAX_SHIP = 7;
Field.MAX_HIBERNATE = Actor.MAX_EXPLOSION * 5;
Field.PHASE = {
	NORMAL: 0,
	BOSS: 1
};
