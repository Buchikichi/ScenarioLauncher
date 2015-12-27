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
	var keys = {};
	var trigger = $('#trigger');

	chassis.setup(reelPatterns);
	$('#trigger').click(function() {
		if (!chassis.isStop()) {
			return;
		}
		chassis.start();
	});
	$(window).keydown(function(e) {
		var ix = 'k' + e.keyCode;
		keys[ix] = e.keyCode;
//console.log(ix);
	});
	$(window).keyup(function(e) {
		var ix = 'k' + e.keyCode;

		if (keys['k16'] || keys['k17'] || keys['k32']) {
			trigger.click();
		}
		delete keys[ix];
	});
	mainLoop();
});

function mainLoop() {
	chassis.draw();
	chassis.judge();
	setTimeout(mainLoop, 33);
}
