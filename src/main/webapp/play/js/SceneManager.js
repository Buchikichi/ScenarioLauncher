/**
 * SceneManager.
 */
function SceneManager() {
	// variables
	this.progress = 0;
	this.iHeso = 0;
	this.iKey = 0;
	this.eNekoatama = 0;

	// member
	this.field = new Field();
	this.isDialogOpen = false;
	this.isWaiting = false;
	this.isChoose = false;
	this.unread = 0;
	this.eventStack = [];
	this.call('');

	// dialog
	var mng = this;
	var dialog = $('#dialog');

	dialog.popup({
		x: 0,
		y: 0,
		afterclose: function (event, ui) {
			mng.isDialogOpen = false;
		}
	});
	dialog.click(function() {
		if (mng.isChoose) {
			return false;
		}
		if (mng.isWaiting) {
			$('#dialogText').empty();
		} else {
			mng.closeDialog();
		}
		mng.cancelWaiting();
	});
}
SceneManager.prototype.nextEvent = function() {
	var len = this.eventStack.length;

	if (len == 0) {
		return false;
	}
	if (this.isWaiting || this.isChoose) {
		return true;
	}
	var gen = this.eventStack[len - 1];
	var res = gen.next();

	if (res.done) {
		this.eventStack.pop();
		if (this.eventStack.length ==0 && this.unread == 0) {
			this.closeDialog();
		}
		this.cancelWaiting();
	}
	return true;
}
SceneManager.prototype.verifyEvent = function() {
	if (this.field) {
		var eventId = this.field.mapEvent;

		if (eventId) {
			this.call(eventId);
		}
	}
}
SceneManager.prototype.cancelWaiting = function() {
	$('#dialog').find('.waiting').each(function(ix, obj) {
		$(obj).remove();
	});
	this.isWaiting = false;
	this.isChoose = false;
	this.unread = 0;
}

//-----------------------------------------------------------------------------
// Reserved functions.
//-----------------------------------------------------------------------------
SceneManager.prototype.call = function(eventId) {
	var mng = this;

	$.ajax('/event/', {
		'type': 'POST',
		'data': {'eventId': eventId},
		'success': function(data) {
			var contents = 'function* gen() {' + data.contents + '}';

console.log(contents);
			eval(contents);
			mng.eventStack.push(gen());
		}
	});
}
SceneManager.prototype.jump = function(mapId, x, y) {
	this.field.change(mapId, x, y);
}
SceneManager.prototype.actor = function(id, charNum, x, y, ptn, ev) {
	this.field.addActor(id, charNum, x, y, ptn, ev);
}
SceneManager.prototype.openDialog = function() {
	$('#dialog').popup('open');
	if (!this.isDialogOpen) {
		$('#dialogImage').empty();
		$('#dialogText').empty();
		this.isDialogOpen = true;
	}
}
SceneManager.prototype.closeDialog = function() {
	$('#dialog').popup('close');
	this.isDialogOpen = false;
}
SceneManager.prototype.img = function(imgId, title) {
	this.openDialog();
	var img = $('<img/>');

	img.attr('src', '/actor/image/shop' + imgId);
	$('#dialogImage').empty();
	$('#dialogImage').append(img);
}
SceneManager.prototype.print = function(contents) {
	this.openDialog();
	$('#dialogText').append(contents);
	this.unread++;
}
SceneManager.prototype.wait = function() {
	var span = $('<span class="waiting">...</span>');

	$('#dialogText').append(span);
	this.isWaiting = true;
}
SceneManager.prototype.choose = function(choices) {
	var mng = this;
	var dialogText = $('#dialogText');
	var span = $('<span class="choose waiting"></span>');

	dialogText.append(span);
	this.isChoose = true;
	$.each(choices, function(ix, elm) {
		var btn = $(elm);

		btn.click(function() {
			$('#dialogText').empty();
			mng.dialog = ix + 1;
			mng.cancelWaiting();
			return false;
		});
		span.append(btn);
	});
}
