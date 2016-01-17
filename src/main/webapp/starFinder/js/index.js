$(document).ready(function() {
	var view = $('#view');
	var slider = $('#slider');
	var constellationSwitch = $('#constellationSwitch');
	var field = new Field(900, 900);
	var cx = 0;
	var cy = 0;
	var start = function(e) {
		var isMouse = e.type.match(/^mouse/);

		if (isMouse) {
			cx = e.clientX;
			cy = e.clientY;
		} else if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			cx = touches.pageX;
			cy = touches.pageY;
		}
	};
	var touch = function(e) {
		var isMouse = e.type.match(/^mouse/);
		var tx;
		var ty;

		if (isMouse) {
			if (!e.buttons) {
				return;
			}
			tx = e.clientX;
			ty = e.clientY;
		} else if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			tx = touches.pageX;
			ty = touches.pageY;
		}
		var diffH = cx - tx;
		var diffV = cy - ty;

		field.rotateH(diffH);
		field.rotateV(diffV);
		cx = tx;
		cy = ty;
	};

	view.mousedown(start);
	view.mousemove(touch);
	view.bind('touchstart', start);
	view.bind('touchmove', touch);
	slider.change(function() {
		field.maxMag = $(this).val();
	});
	constellationSwitch.change(function() {
		field.showConstellation = $(this).is(':checked');
	});
	// init
	slider.change();
	constellationSwitch.change();
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
