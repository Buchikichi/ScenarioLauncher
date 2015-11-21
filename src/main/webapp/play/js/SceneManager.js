/**
 * SceneManager.
 */
function SceneManager() {
	this.field = new Field();
	this.reset();
	this.initDialog();
}
SceneManager.prototype.reset = function() {
	this.isDialogOpen = false;
	this.isWaiting = false;
	this.isChoose = false;
	this.unread = 0;
	this.eventStack = [];
	this.reservedEvent = null;
	this.call('');
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

//	console.log('yield:' + res.value);
	if (res.done) {
		this.eventStack.pop();
		if (this.eventStack.length == 0 && this.unread == 0) {
			this.closeDialog();
			this.cancelWaiting();
		}
	}
	return true;
}
SceneManager.prototype.verifyEvent = function() {
	if (this.field) {
		var eventId = this.field.hitEvent();

		if (eventId) {
			this.call(eventId);
		}
	}
}
SceneManager.prototype.cancelWaiting = function() {
	$('#dialog').find('.waiting').each(function(ix, obj) {
		$(obj).remove();
	});
	this.unread = 0;
	this.isWaiting = false;
	this.isChoose = false;
}
//-----------------------------------------------------------------------------
// Dialog.
//-----------------------------------------------------------------------------
SceneManager.prototype.initDialog = function() {
	// dialog
	var mng = this;
	var dialog = $('#dialog');

	dialog.popup({
		x: 0,
		y: 0,
		beforeposition: function (event, ui) {
			$('#dialogImage').empty();
			$('#dialogText').empty();
			mng.isDialogOpen = true;
		},
		afterclose: function (event, ui) {
			mng.unread = 0;
			mng.isDialogOpen = false;
			if (mng.reservedEvent != null) {
				mng.call(mng.reservedEvent);
				mng.reservedEvent = null;
			}
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
SceneManager.prototype.openDialog = function() {
	$('#dialog').popup('open');
}
SceneManager.prototype.closeDialog = function() {
	$('#dialog').popup('close');
}
SceneManager.prototype.showItems = function() {
	var mng = this;
	var dialogText = $('#dialogText');
	var ul = $('<ul data-theme="a" data-role="listview" data-inset="true" data-split-icon="action"></ul>');
	var gold = $('<li>Gold<span class="ui-li-count">' + this.gold + '</span></li>');

	this.openDialog();
	dialogText.append(ul);
	ul.append(gold);
	$.ajax('/item/', {
		'type': 'POST',
		'data': {},
		'success': function(data) {
			var itemList = [];

			$.each(data, function(ix, item) {
				var numOfItem = mng[item.id];

				if (!numOfItem) {
					return;
				}
				var li = $('<li></li>');
				var anchor = $('<a href="#"></a>');
				var img = $('<img class="ui-li-icon"/>');
				var name = $('<span>' + item.name + '</span>');
				var cnt = $('<span class="ui-li-count">' + numOfItem + '</span>');
				var act = $('<a href="#"></a>');

				img.attr('src', '/item/image/' + item.src);
				anchor.append(img);
				anchor.append(name);
				anchor.append(cnt);
				li.append(anchor);
				li.append(act);
				ul.append(li);
				anchor.click(function() {return false;});
				act.click(function() {
					mng.reservedEvent = item.id;
				});
			});
			ul.listview();
		}
	});
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

//			console.log(contents);
			eval(contents);
			mng.eventStack.push(gen());
		}
	});
}
SceneManager.prototype.jump = function(mapId, x, y) {
	this.field.change(mapId, x, y);
}
SceneManager.prototype.check = function(mapId, x, y) {
	this.field.check(mapId, x, y);
}
SceneManager.prototype.actor = function(id, charNum, x, y, ptn, ev) {
	this.field.addActor(id, charNum, x, y, ptn, ev);
}
SceneManager.prototype.bye = function(id) {
	this.field.removeActor(id);
}
SceneManager.prototype.enemy = function(id, charNum, x, y, ptn, level, ev) {
	this.field.addActor(id, charNum, x, y, ptn, ev);
}
SceneManager.prototype.img = function(imgId, title) {
	this.openDialog();
	var dialogImage = $('#dialogImage');
	var img = $('<img/>');
	var caption = $('<span>' + title + '</span>');

	img.attr('src', '/actor/image/shop' + imgId);
	dialogImage.empty();
	dialogImage.append(img);
	dialogImage.append(caption);
}
SceneManager.prototype.print = function(contents) {
	this.openDialog();
	this.unread++;
	$('#dialogText').append(contents);
}
SceneManager.prototype.wait = function() {
	var span = $('<span class="waiting">●</span>');

	$('#dialogText').append(span);
	this.isWaiting = true;
}
SceneManager.prototype.choose = function(choices) {
	var mng = this;
	var span = $('<span class="choose waiting"></span>');

	$('#dialogText').append(span);
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
		span.append('\n');
	});
}
SceneManager.prototype.gameOver = function() {
	this.reservedEvent = '';
}
