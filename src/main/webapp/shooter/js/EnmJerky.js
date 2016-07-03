/**
 * EnmJerky.
 */
function EnmJerky() {
	Enemy.apply(this, arguments);
	this.speed = 3;
	this.hitPoint = 1;
	this.score = 10;
	this.img.src = 'img/enmJerky.png';
	this.routine = [
		new Movement(Movement.COND.X).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X),
		new Movement(Movement.COND.Y).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_Y)
	];
}
EnmJerky.prototype = Object.create(Enemy.prototype);
