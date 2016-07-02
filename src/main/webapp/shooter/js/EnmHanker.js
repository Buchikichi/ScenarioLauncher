/**
 * EnmHanker.
 */
function EnmHanker() {
	Enemy.apply(this, arguments);
	this.speed = 2;
	this.hitPoint = 8;
	this.score = 100;
	this.img.src = 'img/enmHanker.png';
	this.routine = [
		new Movement().add(Gizmo.TYPE.AIM, Gizmo.DEST.ROTATE).add(Gizmo.TYPE.CHASE, Gizmo.DEST.TO)
	];
}
EnmHanker.prototype = Object.create(Enemy.prototype);
