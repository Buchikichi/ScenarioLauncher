/**
 * Actor.
 */
function Actor(charId, charNum) {
	this.id = charId;
	this.num = charNum;
	this.d = 0; // direction
	this.s = 0; // step

	var div = $('#' + charId);
	if (0 < div.length == 0) {
		div = $('<div></div>');
		div.attr('id', charId);
		div.addClass('actor');
		$('#view').add(div);
	}
	this.element = div;
	this.element.hide();
	this.element.css('background-image', 'url(/actor/image/' + this.num + ')');
}
Actor.prototype.STRIDE = 8;

Actor.prototype.jump = function(x, y) {
	this.x = x;
	this.y = y;
	this.element.show();
}
Actor.prototype.show = function(viewX, viewY) {
	var top = (this.y - viewY) * this.STRIDE;
	var left = (this.x - viewX) * this.STRIDE;
	var posX = this.d * 64 + this.s * 32;
	var position = -posX + 'px 0px';

	this.element.offset({ top: top, left: left });
	this.element.css('background-position', position);
}
