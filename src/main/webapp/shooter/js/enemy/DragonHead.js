/**
 * DragonHead.
 */
class DragonHead extends Enemy {
	constructor(x, y) {
		super(x, y);
		this.region = new Region(this, 16);
		if (0 < this.x) {
			this.x += 50;
		} else {
			this.x -= 50;
		}
		this.hasBounds = false;
		this.speed = .9;
		this.effectH = false;
		this.hitPoint = 200;
		this.score = 10000;
		this.radian = Math.PI;
		this.appears = false;
		this.anim = new Animator(this, 'enemy/dragonHead.png');

		this.locus = [];
		this.body = [];
		for (let cnt = 0; cnt < DragonHead.CNT_OF_BODY * DragonHead.STP_OF_BODY; cnt++) {
			this.locus.push({x:this.x, y:this.y, radian:this.radian});
			if (cnt % DragonHead.STP_OF_BODY == 0) {
				let body = new DragonBody(this.x, this.y);
				this.body.push(body);
			}
		}
		this.chamberList = [new Chamber(TitanShot, 80, 1)];
	}

	eject() {
		super.eject();
		this.body.forEach(function(body) {
			body.hitPoint = 0;
			body.explosion = Actor.MAX_EXPLOSION;
		});
	}

	move(target) {
		let head = this;
		let rad = Math.trim(this.radian + this.closeGap(target) * .9);

		this.dir = rad;
		this.radian = rad;
		super.move(target);
		this.chamberList.forEach(function(chamber) {
			chamber.probe();
		});
	//console.log('LEN:' + this.locus.length);
		for (let cnt = 0; cnt < DragonHead.CNT_OF_BODY; cnt++) {
			let body = this.body[cnt];
			let ix = (cnt + 1) * DragonHead.STP_OF_BODY - 1;
			let locus = this.locus[ix];

			body.x = locus.x;
			body.y = locus.y;
			body.radian = locus.radian;
		}
		this.locus.unshift({x:this.x, y:this.y, radian:this.radian});
		this.locus.pop();
		if (this.appears) {
			let result = [];

			this.chamberList.forEach(function(chamber) {
				let shot = chamber.fire(head);

				if (shot) {
					shot.dir = head.dir;
					shot.radian = head.dir;
					result.push(shot);
				}
			});
			return result;
		}
		this.appears = true;
		return this.body;
	}
}
DragonHead.CNT_OF_BODY = 10;
DragonHead.STP_OF_BODY = 32;
ImageManager.Instance.reserve(['enemy/dragonHead.png', 'enemy/dragonBody.png']);
