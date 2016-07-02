/**
 * Enemy.
 */
function Enemy() {
	Actor.apply(this, arguments);
	this.routine = null;
	this.routineIx = 0;
	this.triggerCycle = 0;
}
Enemy.prototype = Object.create(Actor.prototype);

Enemy.TRIGGER_CYCLE = 30;
Enemy.LIST = [
	{name:'Waver', type:EnmWaver, img:'enmWaver.png'},
	{name:'Bouncer', type:EnmBouncer, img:'enmBouncer.png'},
	{name:'Hanker', type:EnmHanker, img:'enmHanker.png'},
	{name:'Tentacle', type:EnmTentacle, img:'enmTentacle.png'},
	{name:'Dragon', type:EnmDragonHead, img:'enmDragonHead.png'},
	{name:'Waver(formation)', type:EnmWaver, img:'enmWaver.png', formation: true}
];
Enemy.assign = function(ix, x, y) {
	var enemy = Object.assign({}, Enemy.LIST[ix % Enemy.LIST.length]);

	enemy.x = x;
	enemy.y = y;
	return enemy;
};

Enemy.prototype.trigger = function() {
	if (this.triggerCycle++ < Enemy.TRIGGER_CYCLE) {
		return false;
	}
	this.triggerCycle = 0;
	return true;
};

Enemy.prototype.actor_move = Actor.prototype.move;
Enemy.prototype.move = function(target) {
	var enemy = this;

	if (this.routine) {
		var mov = this.routine[this.routineIx];

		mov.list.forEach(function(giz) {
			enemy.dir = giz.calc(enemy, target);
		});
		if (this.dir == null) {
			this.routineIx++;
			if (this.routine.length <= this.routineIx) {
				this.routineIx = 0;
			}
		}
	}
	this.actor_move(target);
};
