/**
 * Actor.
 */
function Actor(charId, charNum, pattern, event) {
	this.id = charId;
	this.num = charNum;
	this.ptn = pattern;
	this.ev = event;
	this.d = 0; // direction
	this.s = 0; // step
	this.cnt = 0; // walking

	var div = $('#' + charId);
	if (0 < div.length == 0) {
		div = $('<div></div>');
		div.attr('id', charId);
		div.addClass('actor');
		$('#view').append(div);
	}
	this.element = div;
	this.element.hide();
	this.element.css('background-image', 'url(/actor/image/' + this.num + ')');
}
Actor.prototype.STRIDE = 8;

Actor.prototype.jump = function(x, y) {
	this.x = x;
	this.y = y;
}
Actor.prototype.step = function() {
	this.s = (++this.s) % 2;
}
Actor.prototype.walk = function() {
	this.cnt++;
	if (this.cnt < 6) {
		return;
	}
	this.cnt = 0;
	this.step();
}
Actor.prototype.show = function(viewX, viewY) {
	var top = (this.y - viewY) * this.STRIDE;
	var left = (this.x - viewX) * this.STRIDE;
	var posX = this.d * 64 + this.s * 32;
	var position = -posX + 'px 0px';

	this.element.offset({ top: top, left: left });
	this.element.css('background-position', position);
	this.element.show();
}
Actor.prototype.isHit = function(x, y, d) {
	var hitX = x - 2 <= this.x && this.x <= x + 2;
	var hitY = y <= this.y && this.y <= y + 3;
	var isHit = hitX && hitY;

	if (isHit && this.ptn == 2) {
		this.d = 3 - d;
	}
	return isHit;
}
