Enemy.LIST = [
	{name:'Waver', type:EnmWaver, img:'enemy/waver.png', h:16},
	{name:'Battery', type:EnmBattery, img:'enemy/battery.png'},
	{name:'Bouncer', type:EnmBouncer, img:'enemy/bouncer.png'},
	{name:'Hanker', type:EnmHanker, img:'enemy/hanker.png'},
	{name:'Jerky', type:EnmJerky, img:'enemy/jerky.png'},
	{name:'Juno', type:EnmJuno, img:'enemy/juno.png'},
	{name:'Crab', type:EnmCrab, img:'enemy/crab.png'},
	{name:'Tentacle', type:EnmTentacle, img:'enemy/tentacle.png'},
	{name:'Dragon', type:EnmDragonHead, img:'enemy/dragonHead.png'},
	{name:'Waver(formation)', type:EnmWaver, img:'enemy/waver.png', h:16, formation: true},
	{name:'Molten', type:Molten, img:'boss/molten.png'},
	{name:'Winding', type:Winding, img:'boss/winding.png'},
	{name:'Titan', type:Titan, img:'boss/titan.icon.png'},
	{name:'Cascade', type:Cascade, img:'material/cascade.icon.png'},
	{name:'Rewinder', type:Rewinder, img:'material/cascade.icon.png'}
];
Stage.LIST = [
//	new Stage(Stage.SCROLL.OFF, 'g1.4.map.png', [
//			new StageBg('stage01bg0.png', 1), new StageBg('stage01bg1.png', .9), new StageFg('g1.4.png'),
//		]).setBgm('g1.4', 'bgm-edo-omega-zero'),
//	new Stage(Stage.SCROLL.OFF, 'stage-map.png', [
//			new StageBg('stage01bg1.png', .7), new StageBg('stage01bg0.png', .9), new StageFg('stage-bg.png'),
//		]).setBgm('bgm-edo-beth', 'bgm-edo-omega-zero'),
//	new Stage(Stage.SCROLL.OFF, 'stage1.map.png', [
//			new StageBg('stage01bg1.png', .7), new StageBg('stage01bg0.png', .9), new StageFg('stage1.1.0.png', 1.3),
//		]).setBgm('bgm-MadNightDance', 'bgm-edo-omega-zero'),
//	new Stage(Stage.SCROLL.ON, 'stage2.map.png', [
//			new StageBg('stage2.1.1.png', .7), new StageBg('stage01bg1.png', 2, -Math.SQ / 2), new StageFg('stage2.1.0.png'),
//		]).setBgm('bgm-pierrot-cards', 'bgm-edo-omega-zero'),
//	new Stage(Stage.SCROLL.OFF, 'stage3.map.png', [
//			new StageBg('stage01bg1.png', .7), new StageFg('stage3.1.1.png', 1, 0, .02), new StageFg('stage3.1.0.png'),
//		]).setBgm('bgm-pierrot-cards', 'bgm-edo-omega-zero'),
	new Stage(Stage.SCROLL.OFF, 'stage00map.png', [
			new StageBg('stage01bg0.png', .7), new StageBg('stage01bg1.png', .9, 0, .02), new StageFg('stage00bg.png'),
		]).setBgm('bgm-edo-beth'),
	new Stage(Stage.SCROLL.OFF, 'stage01map.png', [
			new StageBg('stage01bg1.png', .7, 0, .02), new StageBg('stage01bg0.png', .6), new StageFg('stage01bg.png', 1.3),
		]).setBgm('bgm-MadNightDance', 'bgm-edo-omega-zero'),
	new Stage(Stage.SCROLL.LOOP, 'stage00map.png', [
			new StageBg('stage01bg0.png', .7), new StageBg('stage01bg1.png', .9, 0, .02), new StageFg('stage00bg.png'),
		]).setBgm('bgm-edo-beth'),
	new Stage(Stage.SCROLL.ON, 'stage02map.png', [
			new StageBg('stage01bg1.png', .7), new StageBg('stage01bg0.png', .9), new StageFg('stage02bg.png'),
		]).setBgm('bgm-pierrot-cards', 'bgm-edo-omega-zero'),
];
AudioMixer.INSTANCE.reserve([
	'sfx-fire', 'sfx-explosion', 'sfx-absorb',
	'bgm-edo-beth', 'bgm-MadNightDance', 'bgm-pierrot-cards', 'bgm-edo-omega-zero'
,'g1.4'
]);
MotionManager.INSTANCE.reserve(['asf', '79_91.amc', '79_96.amc', '86_01b.amc', '111_7.amc', '133_01.amc']);
