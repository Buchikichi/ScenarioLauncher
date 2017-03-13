/**
 * Ship.
 */
class Ship extends Actor {
	constructor(x, y) {
		super(x, y);
		this.speed = 2.5;
		this.effectH = false;
		this.shotList = [];
		this.chamberList = [
			new Chamber(Shot, 4, Ship.MAX_SHOTS),
			new Chamber(Missile, 16, 2, {gravity:.05, dir:0}), new Chamber(Missile, 16, 2, {gravity:-.05, dir:0}),
			new Chamber(Missile, 16, 2, {gravity:.05, dir:Math.PI}), new Chamber(Missile, 16, 2, {gravity:-.05, dir:Math.PI}),
		];
		this.anim = new Animator(this, 'ship001.png', Animator.TYPE.V, 1, Ship.PATTERNS * 2 + 1);
		this.reset();
	}

	recalculation() {
		let field = Field.Instance;

		super.recalculation();
		if (field) {
			this.right = field.width - this.width * 3;
			this.bottom = field.height - this.hH;
		}
	}

	reset() {
		this.trigger = false;
		this.chamberList.forEach(function(chamber) {
			chamber.reset();
		});
		this.shotList = [];
	}

	inkey(keys) {
		let hit = false;
		let dir = 0;

		if (keys['ArrowLeft'] || keys['Left'] || keys['k37']) {
			dir = 1;
			hit = true;
		} else if (keys['ArrowRight'] || keys['Right'] || keys['k39']) {
			dir = -1;
			hit = true;
		}
		if (keys['ArrowUp'] || keys['Up'] || keys['k38']) {
			dir = 2 - dir * .5;
			hit = true;
		} else if (keys['ArrowDown'] || keys['Down'] || keys['k40']) {
			dir *= .5;
			hit = true;
		}
		if (hit) {
			this.dir = (dir + 1) * Math.SQ;
		}
	}

	sieveShots() {
		let shotList = [];

		this.shotList.forEach(function(shot) {
			if (shot.isGone) {
				return;
			}
			shotList.push(shot);
		});
		this.shotList = shotList;
	}

	move() {
		super.move();
		this.chamberList.forEach(function(chamber) {
			chamber.probe();
		});
		if (this.isGone) {
			return;
		}
		if (this.walled) {
			this.fate();
			return;
		}
		if (this.x < this.hW || this.right < this.x) {
			this.x = this.svX;
		}
		if (this.y < this.hH || this.bottom < this.y) {
			this.y = this.svY;
		}
		let ship = this;

		// shot & missile
		this.sieveShots();
		if (this.trigger) {
			let result = [];

			this.trigger = false;
			this.chamberList.forEach(function(chamber) {
				let shot = chamber.fire(ship);

				if (shot) {
					ship.shotList.push(shot);
					result.push(shot);
				}
			});
			return result;
		}
	}
}
Ship.MAX_SHOTS = 7;
Ship.PATTERNS = 2;
