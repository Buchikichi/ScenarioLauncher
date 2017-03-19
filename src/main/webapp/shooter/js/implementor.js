Enemy.LIST = [
	{name:'Waver', type:Waver, img:'enemy/waver.png', h:16},
	{name:'Battery', type:Battery, img:'enemy/battery.png'},
	{name:'Bouncer', type:Bouncer, img:'enemy/bouncer.png'},
	{name:'Hanker', type:Hanker, img:'enemy/hanker.png'},
	{name:'Jerky', type:Jerky, img:'enemy/jerky.png'},
	{name:'Juno', type:Juno, img:'enemy/juno.png'},
	{name:'Crab', type:Crab, img:'enemy/crab.png'},
	{name:'Hatch', type:Hatch, img:'enemy/hatch.png', h:16},
	{name:'Charger', type:Charger, img:'enemy/charger.png', h:16},
	{name:'Twister', type:Twister, img:'enemy/twister.png', h:16},
	{name:'Slur', type:Slur, img:'enemy/slur.png', h:16},
	{name:'Waver', type:Waver, img:'enemy/waver.png', h:16},
	{name:'Waver', type:Waver, img:'enemy/waver.png', h:16},
	{name:'Waver', type:Waver, img:'enemy/waver.png', h:16},
	{name:'Waver', type:Waver, img:'enemy/waver.png', h:16},
	{name:'Waver', type:Waver, img:'enemy/waver.png', h:16},
	{name:'Waver', type:Waver, img:'enemy/waver.png', h:16},
	{name:'Waver', type:Waver, img:'enemy/waver.png', h:16},
	{name:'Waver', type:Waver, img:'enemy/waver.png', h:16},
	{name:'Waver', type:Waver, img:'enemy/waver.png', h:16},

	{name:'Tentacle', type:Tentacle, img:'enemy/tentacle.png'},
	{name:'Dragon', type:DragonHead, img:'enemy/dragonHead.png'},
	{name:'Waver(formation)', type:Waver, img:'enemy/waver.png', h:16, formation: true},
//	{name:'Twister(formation)', type:Twister, img:'enemy/waver.png', h:16, formation: true},

	{name:'Molten', type:Molten, img:'boss/molten.png'},
	{name:'Winding', type:Winding, img:'boss/winding.png'},
	{name:'Titan', type:Titan, img:'boss/titan.icon.png'},
	{name:'Cascade', type:Cascade, img:'material/cascade.icon.png'},
	{name:'Rewinder', type:Rewinder, img:'material/cascade.icon.png'}
];
Stage.LIST = [
/*	new Stage(Stage.SCROLL.LOOP, 'g1.2.map.png', [
			new StageBg('stage01bg0.png', .5), new StageBg('stage01bg1.png', .4), new StageFg('g1.2.png'),
		]).setBgm('g1.2', 'bgm-edo-omega-zero'),
	new Stage(Stage.SCROLL.OFF, 'g1.4.map.png', [
			new StageBg('stage01bg0.png', .5), new StageBg('stage01bg1.png', .4), new StageFg('g1.4.png'),
		]).setBgm('g1.4', 'bgm-edo-omega-zero'),
//*/
	new Stage(Stage.SCROLL.OFF, 'stage00map.png', [
			new StageBg('stage01bg0.png', .3), new StageBg('stage01bg1.png', .4, 0, .02), new StageFg('stage00bg.png'),
		]).setBgm('bgm-edo-beth'),
	new Stage(Stage.SCROLL.OFF, 'stage01map.png', [
			new StageBg('stage01bg1.png', .3, 0, .02), new StageBg('stage01bg0.png', .3), new StageFg('stage01bg.png', .6),
		]).setBgm('bgm-MadNightDance', 'bgm-edo-omega-zero'),
	new Stage(Stage.SCROLL.LOOP, 'stage00map.png', [
			new StageBg('stage01bg0.png', .3), new StageBg('stage01bg1.png', .4, 0, .02), new StageFg('stage00bg.png'),
		]).setBgm('bgm-edo-beth'),
	new Stage(Stage.SCROLL.ON, 'stage02map.png', [
			new StageBg('stage01bg1.png', .3), new StageBg('stage01bg0.png', .4), new StageFg('stage02bg.png'),
		]).setBgm('bgm-pierrot-cards', 'bgm-edo-omega-zero'),
	//*/

//	new Stage(Stage.SCROLL.OFF, 'stage-map.png', [
//			new StageBg('stage01bg1.png', .3), new StageBg('stage01bg0.png', .4), new StageFg('stage-bg.png'),
//		]).setBgm('bgm-edo-beth', 'bgm-edo-omega-zero'),
	new Stage(Stage.SCROLL.OFF, 'stage1.map.png', [
			new StageBg('stage01bg1.png', .3), new StageBg('stage01bg0.png', .4), new StageFg('stage1.1.0.png', .6),
		]).setBgm('bgm-ThroughTheDark', 'bgm-edo-omega-zero'),
	new Stage(Stage.SCROLL.ON, 'stage2.map.png', [
			new StageBg('stage2.1.1.png', .3), new StageBg('stage01bg1.png', 1, -Math.SQ / 2), new StageFg('stage2.1.0.png'),
		]).setBgm('bgm-pierrot-cards', 'bgm-edo-omega-zero'),
	new Stage(Stage.SCROLL.OFF, 'stage3.map.png', [
			new StageBg('stage01bg1.png', .3), new StageFg('stage3.1.1.png', .5, 0, .02), new StageFg('stage3.1.0.png'),
		]).setBgm('bgm-YourDream-R', 'bgm-edo-omega-zero'),
	new Stage(Stage.SCROLL.LOOP, 'stage4.map.png', [
			new StageBg('stage01bg1.png', .3), new StageFg('stage01bg0.png', .5, 0, .02), new StageFg('stage4.1.0.png', .3),
		]).setBgm('bgm-MadNightDance', 'bgm-edo-omega-zero'),
];
AudioMixer.INSTANCE.reserve([
	'sfx-fire', 'sfx-explosion', 'sfx-absorb',
]);
MotionManager.INSTANCE.reserve(['asf', '79_91.amc', '79_96.amc', '86_01b.amc', '111_7.amc', '133_01.amc']);
