$(document).ready(function() {
	var view = $('#view');
	var slider = $('#slider');
	var field = new Field(1024, 1024);
	var cx = 0;
	var cy = 0;

	view.mousedown(function(e) {
		cx = e.clientX;
		cy = e.clientY;
	});
	view.mousemove(function(e) {
		if (!e.buttons) {
			return;
		}
		var diff = cx - e.clientX;

		field.rotateH(diff);
		cx = e.clientX;
		cy = e.clientY;
	});
	slider.change(function() {
		field.maxMag = $(this).val();
	});
	slider.change();
	activate(field);
});

/**
 * 実行.
 */
function activate(field) {
	setTimeout(function() {
		field.draw();
		activate(field);
	}, 66);
}
