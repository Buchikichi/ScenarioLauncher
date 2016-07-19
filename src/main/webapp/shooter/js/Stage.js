function Stage() {
}
Stage.SCROLL = {
	OFF: 0,
	ON: 1,
	LOOP: 2
};
Stage.LIST = [
	{speed:1,   scroll:Stage.SCROLL.OFF, img:'stage00bg.png', map:'stage00map.png', bgm:'bgm-edo-beth.mp3'},
	{speed:1.3, scroll:Stage.SCROLL.OFF, img:'stage01bg.png', map:'stage01map.png', bgm:'bgm-MadNightDance.mp3', boss:'bgm-edo-omega-zero.mp3'},
	{speed:1,   scroll:Stage.SCROLL.OFF, img:'stage00bg.png', map:'stage00map.png', bgm:'bgm-edo-beth.mp3'},
	{speed:1,   scroll:Stage.SCROLL.ON,  img:'stage02bg.png', map:'stage02map.png', bgm:'bgm-pierrot-cards.mp3'},
];
