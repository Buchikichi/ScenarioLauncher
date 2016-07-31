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
Stage.LIST = [
//	new Stage(Stage.SCROLL.OFF, 'stage-map.png', 'bgm-edo-beth').addBoss('bgm-edo-omega-zero')
//		.bg('stage-bg.png').bg('stage01bg0.png', .9).bg('stage01bg1.png', .7),
	new Stage(Stage.SCROLL.OFF, 'stage00map.png', 'bgm-edo-beth')
		.bg('stage00bg.png').bg('stage01bg0.png', .9).bg('stage01bg1.png', .7),
	new Stage(Stage.SCROLL.OFF, 'stage01map.png', 'bgm-MadNightDance').addBoss('bgm-edo-omega-zero')
		.bg('stage01bg.png', 1.3).bg('stage01bg0.png', .9).bg('stage01bg1.png', .7),
	new Stage(Stage.SCROLL.LOOP, 'stage00map.png', 'bgm-edo-beth')
		.bg('stage00bg.png').bg('stage01bg0.png', .9).bg('stage01bg1.png', .7),
	new Stage(Stage.SCROLL.ON, 'stage02map.png', 'bgm-pierrot-cards')
		.bg('stage02bg.png').bg('stage01bg0.png', .9).bg('stage01bg1.png', .7),
];
AudioMixer.INSTANCE.addAll([
	'sfx-fire', 'sfx-explosion', 'sfx-absorb',
	'bgm-edo-beth', 'bgm-MadNightDance', 'bgm-pierrot-cards', 'bgm-edo-omega-zero'
]);
