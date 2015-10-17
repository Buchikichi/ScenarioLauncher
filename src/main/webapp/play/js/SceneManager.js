/**
 * SceneManager.
 */
function SceneManager() {
	// variables
	this.progress = 0;

	// member
	this.field = null;
	this.call('');
	this.isInEvent = false;
	this.isDialogOpen = false;

	var mng = this;
	$('#dialog').popup({
		x: 0,
		y: 0,
		afterclose: function (event, ui) {
			mng.isDialogOpen = false;
		}
	});
}
SceneManager.prototype.verifyEvent = function() {
	if (!this.field) {
		return;
	}
	var eventId = this.field.mapEvent;

	if (eventId) {
		this.call(eventId);
	}
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
			var contents = data.contents;

			console.log(contents);
			mng.isInEvent = true;
			eval(contents);
			mng.isInEvent = false;
		}
	});
}
SceneManager.prototype.jump = function(mapId, x, y) {
	this.field = new Field(mapId, x, y);
}
SceneManager.prototype.actor = function(id, x, y, step, name) {
	console.log('**actor');
}
SceneManager.prototype.openDialog = function() {
	$('#dialog').popup('open');
	if (!this.isDialogOpen) {
		$('#dialogImage').empty();
		$('#dialogText').empty();
		this.isDialogOpen = true;
	}
}
SceneManager.prototype.img = function(imgId, title) {
	this.openDialog();
	var img = $('<img/>');

	img.attr('src', '/actor/image/shop' + imgId);
	$('#dialogImage').append(img);
}
SceneManager.prototype.print = function(contents) {
	this.openDialog();
contents += '\n'; // TODO Editor側で付与
	$('#dialogText').append(contents);
}
SceneManager.prototype.choose = function(choices) {
	console.log(choices);
}
