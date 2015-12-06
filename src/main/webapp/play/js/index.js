var mng;

$(document).ready(function() {
	mng = new SceneManager();
	init();
//	setTimeout(function() {
//		mng.cntProgress = 13;
//		mng.reservedEvent = 'w131to132';
//	}, 300);
});

/**
 * 初期処理.
 */
function init() {
	initControls();
	initCover();
	draw();
}
function initControls() {
	var itemBtn = $('#itemBtn');

	itemBtn.click(function() {
		mng.showItems();
	});
}
function initCover() {
	var cover = $('#cover');

	cover.mousedown(touch);
	cover.mousemove(touch);
	cover.mouseup(leave);
	cover.mouseout(leave);
	cover.bind('touchstart', touch);
	cover.bind('touchmove', touch);
	cover.bind('touchend', leave);
}
function touch(e) {
	var view = $('#view');
	var isMouse = e.type.match(/^mouse/);

//	if (mng.field.loading) {
//		leave();
//		return false;
//	}
	if (isMouse && e.buttons == 0) {
		return false;
	}
	var isTouch = e.type.match(/^touch/);
	if (isTouch) {
		var px;
		var py;
		if (e.originalEvent.touches) {
			var touches = e.originalEvent.touches[0];
			px = touches.pageX;
			py = touches.pageY;
		} else {
			px = e.pageX;
			py = e.pageY;
		}
//		console.log('x:' + px + '/x:' + py);
//		console.log('type:' + e.type);
//		console.log(e);
		view.prop('touch', true);
		view.prop('touchX', px);
		view.prop('touchY', py);
		return false;
	}
	view.prop('touch', true);
	view.prop('touchX', e.offsetX);
	view.prop('touchY', e.offsetY);
}
function leave() {
	var view = $('#view');

	view.prop('touch', false);
}
function move() {
	var view = $('#view');

	if (!view.prop('touch') || mng.isDialogOpen) {
		return false;
	}
	var field = mng.field;
	var player = field.protagonist;
	var tx = view.prop('touchX') - field.BRICK_WIDTH + player.STRIDE / 2;
	var ty = view.prop('touchY') - field.BRICK_WIDTH + player.STRIDE / 2;
	var gx = field.viewX + parseInt(tx / player.STRIDE);
	var gy = field.viewY + parseInt(ty / player.STRIDE);
	var d = player.chase(field, gx, gy);

//console.log('x:' + x + '/y:' + y);
	if (d != null) {
		player.d = d;
		player.walk();
	}
	field.checkEvent();
	var x = player.x;
	var y = player.y;
	var hit = field.hitWall(x, y) || field.hitActor(x, y);

	if (!hit && !player.isMove()) {
		return false;
	}
	if (hit) {
		player.back();
	}
	field.scroll();
	return true;
}
function draw() {
	if (!mng.nextEvent() && move()) {
		mng.verifyEvent();
	}
	if (!mng.isDialogOpen) {
		mng.field.show();
	}
	setTimeout(function() {
		draw();
	}, 66);
}
