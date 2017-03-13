/**
 * Chamber.
 */
class Chamber {
	constructor(type, cycle, max, opt) {
		this.type = type;
		this.cycle = cycle;
		this.max = max;
		this.opt = opt;
		this.reset();
	}

	reset() {
		this.tick = 0;
		this.hands = [];
	}

	probe() {
		let validList = [];

		this.hands.forEach(function(elem) {
			if (!elem.isGone) {
				validList.push(elem);
			}
		});
		this.hands = validList;
		this.tick++;
	}

	fire(actor) {
		if (this.tick < this.cycle || this.max <= this.hands.length) {
			return null;
		}
//		if (this.opt) {
//			this.opt.dir = actor.dir ? actor.dir : 0;
//		}
		let x = actor.x;
		let y = actor.y;
		let elem = new this.type(x, y, this.opt);

		this.tick = 0;
		this.hands.push(elem);
		return elem;
	}
}
