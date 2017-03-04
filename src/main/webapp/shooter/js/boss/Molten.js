/**
 * Molten.
 */
class Molten extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		this.margin = Field.HALF_WIDTH;
		this.dir = 0;
		this.speed = 1;
		this.effectH = false;
		this.hitPoint = Number.MAX_SAFE_INTEGER;
		this.cycle = 0;
		this.phase = Molten.PHASE.TARGET;
		this.rock = [];
		this.appears = false;
		this.anim = new Animator(this, 'boss/molten.png', Animator.TYPE.NONE);
		this.routine = [
			new Movement().add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE)
		];
	}

	move(target) {
		super.move(target);
		if (Molten.MAX_CYCLE < this.cycle++) {
			this.cycle = 0;
			this.phase++;
			this.phase %= Molten.PHASE.length;
		}
		if (this.appears) {
			this.checkDestroy(target);
			return [];
		}
		this.appears = true;
		let rock = new MoltenRock(this.field, this, this.x, this.y);
		this.rock = [rock];
		return [rock];
	}

	checkDestroy(target) {
		let validList = [];
		this.rock.forEach(function(rock) {
			if (!rock.isGone) {
				validList.push(rock);
			}
		});
		if (validList.length == 0) {
			this.hitPoint = 0;
			this.fate(target);
		}
		this.rock = validList;
	}
}
Molten.MAX_CYCLE = 500;
Molten.PHASE = {
	OWN: 0,
	TARGET: 1,
	length: 2
};

/**
 * MoltenRock.
 */
class MoltenRock extends Enemy {
	constructor(field, parent, x, y) {
		super(field, x, y);
		this.margin = Field.HALF_WIDTH;
		this.parent = parent;
		this.dir = 0;
		this.speed = 1.3;
		this.hitPoint = 5;
		this.score = 10;
		this.anim = new Animator(this, 'boss/moltenRock.png', Animator.TYPE.NONE);
		this.routine = [
			new Movement().add(Gizmo.TYPE.CHASE, Gizmo.DEST.ROTATE)
		];
	}

	move(target) {
		let result = [];
		let parent = this.parent;

		if (parent.phase == Molten.PHASE.OWN) {
			result = super.move(parent);
		} else {
			super.move(target);
		}
		if (this.absorbed && this.hitPoint) {
			let dir = Math.trim(this.dir + Math.SQ);
			for (let cnt = 0; cnt < 3; cnt++) {
				let child = new MoltenRock(this.field, parent, this.x, this.y);

				child.dir = dir;
				child.speed = this.speed * 1.2;
				child.hitPoint = this.hitPoint;
				result.push(child);
				parent.rock.push(child);
				dir = Math.trim(dir + Math.SQ);
			}
		}
		this.absorbed = false;
		return result;
	}
}
