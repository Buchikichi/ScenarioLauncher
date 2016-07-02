/**
 * EnmJerky.
 */
function EnmJerky() {
	Enemy.apply(this, arguments);
	this.speed = 4;
	this.hitPoint = 1;
	this.score = 10;
	this.img.src = 'img/enmJerky.png';
	this.routine = [
		new Movement('x').add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_X),
		new Movement('y').add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO_Y)
	];
}
EnmJerky.prototype = Object.create(Enemy.prototype);
