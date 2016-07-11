/**
 * Enemy.
 */
function Enemy() {
	Actor.apply(this, arguments);
	this.routine = null;
	this.routineIx = 0;
	this.routineCnt = 0;
	this.triggerCycle = 0;
	this.constraint = false;
}
Enemy.prototype = Object.create(Actor.prototype);

Enemy.TRIGGER_CYCLE = 30;
Enemy.TRIGGER_ALLOWANCE = 100;
Enemy.LIST = [
	{name:'Waver', type:EnmWaver, img:'enmWaver.png'},
	{name:'Battery', type:EnmBattery, img:'enmBattery.png'},
	{name:'Bouncer', type:EnmBouncer, img:'enmBouncer.png'},
	{name:'Hanker', type:EnmHanker, img:'enmHanker.png'},
	{name:'Jerky', type:EnmJerky, img:'enmJerky.png'},
	{name:'Juno', type:EnmJuno, img:'enmJuno.png'},
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

		mov.tick(this, target);
	}
	this.actor_move(target);
	if (this.trigger() && Enemy.TRIGGER_ALLOWANCE < this.calcDistance(target)) {
		if (this.constraint) {
			return;
		}
		return [new Bullet(this.field, this.x, this.y).aim(target)];
	}
};
