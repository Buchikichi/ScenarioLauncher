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
Enemy.MAX_TYPE = 0x7f;
Enemy.LIST = [
	{name:'Waver', type:EnmWaver, img:'enmWaver.png', h:16},
	{name:'Battery', type:EnmBattery, img:'enmBattery.png'},
	{name:'Bouncer', type:EnmBouncer, img:'enmBouncer.png'},
	{name:'Hanker', type:EnmHanker, img:'enmHanker.png'},
	{name:'Jerky', type:EnmJerky, img:'enmJerky.png'},
	{name:'Juno', type:EnmJuno, img:'enmJuno.png'},
	{name:'Crab', type:EnmCrab, img:'enmCrab.png'},
	{name:'Tentacle', type:EnmTentacle, img:'enmTentacle.png'},
	{name:'Dragon', type:EnmDragonHead, img:'enmDragonHead.png'},
	{name:'Waver(formation)', type:EnmWaver, img:'enmWaver.png', h:16, formation: true},
	{name:'Molten', type:Molten, img:'boss.Molten.png'},
	{name:'Cascade', type:Cascade, img:'material.Cascade.icon.png'}
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

Enemy.prototype.fire = function(target) {
	var bullet = new Bullet(this.field, this.x, this.y);
	var dist = this.calcDistance(target);
	var estimation = dist / bullet.speed * this.field.landform.speed;
	var dx = target.x - this.x + estimation;
	var dy = target.y - this.y;

	bullet.dir = Math.atan2(dy, dx);
	return [bullet];
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
			return [];
		}
		return this.fire(target);
	}
	return [];
};

/**
 * Chain.
 */
function Chain(field, x, y) {
	Enemy.apply(this, arguments);
	this.prev = null;
	this.next = null;
}
Chain.prototype = Object.create(Enemy.prototype);

Chain.prototype.unshift = function(element) {
	element.next = this;
	element.prev = this.prev;
	if (this.prev) {
		this.prev.next = element;
	}
	this.prev = element;
	return this;
};

Chain.prototype.push = function(element) {
	element.prev = this;
	element.next = this.next;
	if (this.next) {
		this.next.prev = element;
	}
	this.next = element;
	return this;
};

Chain.prototype.remove = function() {
	this.prev.next = this.next;
	this.next.prev = this.prev;
	return this.next;
};
