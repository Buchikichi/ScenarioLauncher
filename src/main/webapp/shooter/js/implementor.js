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
AudioMixer.INSTANCE.addAll([
	'sfx-fire', 'sfx-explosion', 'sfx-absorb',
	'bgm-edo-beth', 'bgm-MadNightDance', 'bgm-edo-omega-zero'
]);
