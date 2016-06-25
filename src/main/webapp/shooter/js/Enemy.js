/**
 * Enemy.
 */
function Enemy() {
	Actor.apply(this, arguments);
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

Enemy.prototype.trigger = function() {
	if (this.triggerCycle++ < Enemy.TRIGGER_CYCLE) {
		return false;
	}
	this.triggerCycle = 0;
	return true;
};
