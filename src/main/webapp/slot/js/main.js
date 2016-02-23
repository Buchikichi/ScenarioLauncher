/**
 * Zauruslot.
 * @author ponta
 */
$(document).ready(function() {
	var reelPatterns = [
		[4, 1, 7, 2, 5, 3, 4, 1, 3, 4, 6, 4, 1, 5, 2, 7, 3, 4, 1, 4, 3],
		[1, 2, 7, 1, 3, 2, 4, 6, 1, 3, 2, 5, 1, 3, 6, 2, 1, 3, 2, 4, 2],
		[4, 1, 7, 3, 1, 2, 3, 4, 1, 2, 5, 3, 4, 1, 2, 6, 3, 4, 1, 2, 3]
	];
	var win = $(window);
	var keys = {};
	var chassis = new Chassis();
	var trigger = $('#trigger');

	chassis.setup(reelPatterns);
	$('#trigger').click(function() {
		if (!chassis.isStop()) {
			return;
		}
		chassis.start();
	});
	win.keydown(function(e) {
		var ix = 'k' + e.keyCode;
		keys[ix] = e.keyCode;
//console.log(ix);
	});
	win.keyup(function(e) {
		var ix = 'k' + e.keyCode;

		if (keys['k16'] || keys['k17'] || keys['k32']) {
			trigger.click();
		}
		delete keys[ix];
	});
	win.resize(function() {
		var bg = $('#bg');
		var body = $('body');
		var header = $('#header');
		var height = body.height() - header.outerHeight(true) - 10;
		var magniH = body.width() / bg.width();
		var magniV = height / bg.height();
		var magni = Math.min(magniH, magniV);
		var scale = 'scale(' + magni + ')';

		bg.css('transform', scale);
	});
	win.resize();
	mainLoop(chassis);
});

function mainLoop(chassis) {
	chassis.draw();
	chassis.judge();
	setTimeout(function() {
		mainLoop(chassis);
	}, 33);
}
