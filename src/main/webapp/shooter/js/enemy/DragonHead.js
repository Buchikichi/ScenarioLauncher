/**
 * DragonHead.
 */
class DragonHead extends Enemy {
	constructor(field, x, y) {
		super(field, x, y);
		if (0 < this.x) {
			this.x += 50;
		} else {
			this.x -= 50;
		}
		this.speed = 1.8;
		this.effectH = false;
		this.hitPoint = 200;
		this.score = 1000;
		this.radian = Math.PI;
		this.appears = false;
		this.anim = new Animator(this, 'enemy/dragonHead.png', Animator.TYPE.NONE);

		this.locus = [];
		this.body = [];
		for (var cnt = 0; cnt < DragonHead.CNT_OF_BODY * DragonHead.STP_OF_BODY; cnt++) {
			this.locus.push({x:this.x, y:this.y, radian:this.radian});
			if (cnt % DragonHead.STP_OF_BODY == 0) {
				var body = new DragonBody(this.field, this.x, this.y);
				this.body.push(body);
			}
		}
		this.chamberList = [new Chamber(TitanShot, 80, 1)];
	}

	recalculation() {
		super.recalculation();
		this.minX = -this.field.width;
		this.minY = -this.field.height;
		this.maxX = this.field.width * 2;
		this.maxY = this.field.height * 2;
	}

	eject() {
		super.eject();
		this.body.forEach(function(body) {
			body.hitPoint = 0;
			body.explosion = Actor.MAX_EXPLOSION;
		});
	}

	move(target) {
		var head = this;
		var rad = Math.trim(this.radian + this.closeGap(target) * 1.8);

		this.dir = rad;
		this.radian = rad;
		super.move(target);
		this.chamberList.forEach(function(chamber) {
			chamber.probe();
		});
	//console.log('LEN:' + this.locus.length);
		for (var cnt = 0; cnt < DragonHead.CNT_OF_BODY; cnt++) {
			var body = this.body[cnt];
			var ix = (cnt + 1) * DragonHead.STP_OF_BODY - 1;
			var locus = this.locus[ix];

			body.x = locus.x;
			body.y = locus.y;
			body.radian = locus.radian;
		}
		this.locus.unshift({x:this.x, y:this.y, radian:this.radian});
		this.locus.pop();
		if (this.appears) {
			var result = [];

			this.chamberList.forEach(function(chamber) {
				var shot = chamber.fire(head);

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
DragonHead.STP_OF_BODY = 16;
