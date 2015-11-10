/**
 * A* node.
 */
function AStarNode(sx, sy, d, gx, gy) {
	var dx = Math.abs(gx - sx);
	var dy = Math.abs(gy - sy);

	this.x = sx;
	this.y = sy;
	this.d = d;
	this.c = 0;
	this.h = dx + dy;
	this.s = this.h;
}
AStarNode.prototype.getKey = function() {
	return this.x + '_' + this.y;
}
AStarNode.prototype.setParent = function(parent) {
	this.parent = parent;
	this.c = parent.c + 1;
	this.s = this.c + this.h;
//console.log('this.c:' + this.c + '|this.h:' + this.h + '|this.s:' + this.s);
//console.log('parent.c:' + parent.c + '|parent.h:' + parent.h + '|parent.s:' + parent.s);
}
