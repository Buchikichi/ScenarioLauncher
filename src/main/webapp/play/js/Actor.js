/**
 * Actor.
 */
function Actor(charId, charNum) {
	this.id = charId;
	this.num = charNum;

	var div = $('#' + charId);
	if (0 < div.length) {
		// 既に存在
		this.element = div;
	} else {
		div = $('<div></div>');
		div.attr('id', charId);
		div.addClass('actor');
		$('#view').add(div);
	}
}
Actor.prototype.STRIDE = 8;
