/**
 * Zauruslot.
 * @author ponta
 */
var reelPatterns = [
	[4, 1, 7, 2, 5, 3, 4, 1, 3, 4, 6, 4, 1, 5, 2, 7, 3, 4, 1, 4, 3],
	[1, 2, 7, 1, 3, 2, 4, 6, 1, 3, 2, 5, 1, 3, 6, 2, 1, 3, 2, 4, 2],
	[4, 1, 7, 3, 1, 2, 3, 4, 1, 2, 5, 3, 4, 1, 2, 6, 3, 4, 1, 2, 3]
];
var chassis = new Chassis();

$(document).ready(function() {
	chassis.setup(reelPatterns);
	$('#trigger').click(function() {
		if (!chassis.isStop()) {
			return;
		}
		if (chassis.coins < 3) {
			return;
		}
		chassis.start();
	});
	mainLoop();
});

function mainLoop() {
	chassis.draw();
	chassis.judge();
	setTimeout(mainLoop, 33);
}
