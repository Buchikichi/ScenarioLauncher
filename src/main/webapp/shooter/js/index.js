/**
 * Shooterメイン処理.
 */
var field = new Field(512, 224);
var keys = {};
var phase = 0;
$(document).ready(function() {
	field.setup();
	loop();
	//
	$(window).keydown(function(e) {
		var ix = 'k' + e.keyCode;
		keys[ix] = e.keyCode;
//console.log(ix);
	});
	$(window).keyup(function(e) {
		var ix = 'k' + e.keyCode;
		delete keys[ix];
	});
});
function loop() {
	field.inkey(keys);
	field.scroll();
	field.draw();
	setTimeout(loop, 33);
}
