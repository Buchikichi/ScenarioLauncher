/**
 * Nachメイン処理.
 */
var field = new Field(512, 224);
var keys = {};
var phase = 0;
$(document).ready(function() {
	var view = $('#view');

	field.setup();
	loop();
	//
	$(window).keydown(function(e) {
		var ix = 'k' + e.keyCode;
		keys[ix] = e.keyCode;
//console.log(ix);
		if (!view.hasClass('addicting')) {
			view.addClass('addicting');
		}
	});
	$(window).keyup(function(e) {
		var ix = 'k' + e.keyCode;
		delete keys[ix];
	});
	view.mousemove(function(e) {
		view.removeClass('addicting');
	});
});
function loop() {
	field.inkey(keys);
	field.scroll();
	field.draw();
	setTimeout(loop, 33);
}
/**
 * さいころ
 */
function die(max) {
	return parseInt(Math.random() * (max + 1)) == 0;
}
