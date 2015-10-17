/**
 * SceneManager.
 */
function SceneManager() {
	this.field = null;
	this.call('');
	this.progress = 0;
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
			eval(contents);
		}
	});
}
SceneManager.prototype.jump = function(mapId, x, y) {
	this.field = new Field(mapId, x, y);
}
SceneManager.prototype.img = function(imgId, title) {
	console.log('**img');
}
SceneManager.prototype.print = function(contents) {
	console.log(contents);
}
SceneManager.prototype.actor = function(id, x, y, step, name) {
	console.log('**actor');
}
SceneManager.prototype.choose = function(choices) {
	console.log(choices);
}
