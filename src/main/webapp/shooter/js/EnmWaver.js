/**
 * EnmWaver.
 */
function EnmWaver() {
	Enemy.apply(this, arguments);
	this.dir = this.x <= 0 ? 0 : Math.PI;
	this.step = Math.PI / 30;
	this.speed = 5;
	this.score = 10;
	this.img.src = 'img/enmWaver.png';
	this.routine = [
		new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L),
		new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
		new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_R),
		new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN, Gizmo.DEST.ROTATE_L)
	];
}
EnmWaver.prototype = Object.create(Enemy.prototype);
EnmWaver.RANGE = 8;
