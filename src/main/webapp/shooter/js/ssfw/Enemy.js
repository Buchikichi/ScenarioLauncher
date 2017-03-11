/**
 * Enemy.
 */
class Enemy extends Actor {
	constructor(field, x, y) {
		super(field, x, y);
		this.radian = Math.PI;
		this.routine = null;
		this.routineIx = 0;
		this.routineCnt = 0;
		this.triggerCycle = 0;
		this.constraint = false;
	}

	trigger() {
		if (this.triggerCycle++ < Enemy.TRIGGER_CYCLE) {
			return false;
		}
		this.triggerCycle = 0;
		return true;
	}

	fire(target) {
		let bullet = new Bullet(this.field, this.x, this.y);
		let dist = this.calcDistance(target);
		let fg = this.field.stage.getFg();
		let estimation = dist / bullet.speed * fg.speed;
		let dx = target.x - this.x + estimation;
		let dy = target.y - this.y;

		bullet.dir = Math.atan2(dy, dx);
		return [bullet];
	}

	move(target) {
		if (this.routine) {
			let mov = this.routine[this.routineIx];

			mov.tick(this, target);
		}
//console.log('enemy[' + this.x + ',' + this.y + ']');
		super.move(target);
		if (this.trigger() && Enemy.TRIGGER_ALLOWANCE < this.calcDistance(target)) {
			if (this.constraint) {
				return [];
			}
			return this.fire(target);
		}
		return [];
	}
}
Enemy.TRIGGER_CYCLE = 50;
Enemy.TRIGGER_ALLOWANCE = 100;
Enemy.MAX_TYPE = 0x7f;
Enemy.LIST = [];
Enemy.assign = function(ix, x, y) {
	let enemy = Object.assign({}, Enemy.LIST[ix % Enemy.LIST.length]);

	enemy.x = x;
	enemy.y = y;
	return enemy;
}

/**
 * Chain.
 */
class Chain extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.prev = null;
		this.next = null;
	}
	unshift(element) {
		element.next = this;
		element.prev = this.prev;
		if (this.prev) {
			this.prev.next = element;
		}
		this.prev = element;
		return this;
	};

	push(element) {
		element.prev = this;
		element.next = this.next;
		if (this.next) {
			this.next.prev = element;
		}
		this.next = element;
		return this;
	};

	remove() {
		this.prev.next = this.next;
		this.next.prev = this.prev;
		return this.next;
	};
}
