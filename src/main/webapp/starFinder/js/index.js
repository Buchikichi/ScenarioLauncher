$(document).ready(function() {
	var view = $('#view');
	var slider = $('#slider');
	var constellationSwitch = $('#constellationSwitch');
	var field = new Field();
	var cx = 0;
	var cy = 0;
	var which = 0;
	var onResize = function() {
		var body = $('body');
		var header = $('#header');
		var footer = $('#footer');
		var height = body.height() - header.outerHeight(true) - footer.outerHeight(true) - 10;
		var width = Math.min(body.width(), height);

		field.resetCanvas(width);
//		console.log('header:' + header.outerHeight());
//		console.log('footer:' + footer.outerHeight());
//		console.log('body:' + body.height());
//		console.log('body:' + body.innerHeight());
	}
	var start = function(e) {
		var isMouse = e.type.match(/^mouse/);

		if (isMouse) {
			cx = e.pageX;
			cy = e.pageY;
		} else if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			cx = touches.pageX;
			cy = touches.pageY;
		}
		which = e.which;
	};
	var touch = function(e) {
		var isMouse = e.type.match(/^mouse/);
		var tx;
		var ty;

		if (isMouse) {
//console.log('which:' + which);
			if (!which) {
				return;
			}
			tx = e.pageX;
			ty = e.pageY;
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
	var end = function(e) {
//console.log('end');
		which = 0;
	};

	$(window).resize(onResize);
	view.mousedown(start);
	view.mousemove(touch);
	view.mouseleave(end);
	view.mouseup(end);
	view.bind('touchstart', start);
	view.bind('touchmove', touch);
	view.bind('touchend', end);
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
	$(window).resize();
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
