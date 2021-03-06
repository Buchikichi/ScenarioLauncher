/**
 * Mocap player main.
 */
document.addEventListener('DOMContentLoaded', function() {
	var view = $('#view');
	var slider = $('#slider');
	var field = new Field();
	var cx = 0;
	var cy = 0;
	var which = 0;
	var onResize = function() {
		var body = $('body');
		var header = $('#header');
		var footer = $('#footer');
		var width = body.width();
		var height = body.height() - header.outerHeight(true) - footer.outerHeight(true) - 16;

		if (height / 9 < width / 16) {
			width = parseInt(height / 9 * 16);
		} else {
			height = parseInt(width / 16 * 9);
		}
		field.resetCanvas(width, height);
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
	var activate = function() {
		var time = AudioMixer.INSTANCE.getCurrentTime();

		if (time) {
			var frame = parseInt(time / 0.025);
//console.log('f:' + frame);
			field.shiftMotion(frame);
			slider.val(frame);
			slider.slider('refresh');
		}
		field.draw();
		setTimeout(activate, 33);
	};

	setupFileList(field);
	view.mousedown(start);
	view.mousemove(touch);
	view.mouseleave(end);
	view.mouseup(end);
	view.bind('touchstart', start);
	view.bind('touchmove', touch);
	view.bind('touchend', end);
	slider.change(function() {
		var frame = $(this).val();
		var time = frame * 0.025;

		field.shiftMotion(frame);
		AudioMixer.INSTANCE.setCurrentTime(time);
	});
	$(window).resize(onResize);
	activate();
	$(window).resize();
	//
	$('#playButton').click(function() {
		var time = AudioMixer.INSTANCE.getCurrentTime();

		if (time) {
			AudioMixer.INSTANCE.fade();
			return;
		}
		AudioMixer.INSTANCE.play('Perfume_globalsite_sound', 1, true);
	});
	AudioMixer.INSTANCE.reserve([
		'Perfume_globalsite_sound',
	]);
});

function setupFileList(field) {
	var ul = $('#searchPanel ul');
	var list = [
		'aachan.bvh', 'kashiyuka.bvh', 'nocchi.bvh',
		'01_01.amc', '07_05.amc', '09_06.amc', '79_96.amc', '111_7.amc', '131_04.amc', '135_06.amc',
	];

	list.forEach(function(name) {
		var anchor = $('<a></a>').text(name);
		var li = $('<li></li>').append(anchor);

		li.attr('data-filtertext', name);
		ul.append(li);
		anchor.click(function() {
			field.loadMotion(name + '.json');
		});
	});
	ul.filterable('refresh');
}
