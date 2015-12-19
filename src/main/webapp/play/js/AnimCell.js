/**
 * Animation Cell.
 */
function AnimCell(mapId, rec) {
	this.x = rec.x * 16;
	this.y = rec.y * 16;
	this.ox = rec.ox * 16;
	this.oy = rec.oy * 16;
	this.layer = rec.layer;
	this.pat = rec.pat;
	this.cnt = 0;
	this.steps = 0;
	this.element = $('<div></div>').addClass('cell');
	if (rec.layer == 0) {
		this.element.addClass('bgCell');
	} else {
		this.element.addClass('upCell');
	}
	this.load(mapId);
}
AnimCell.prototype.load = function(mapId) {
	var uri = '/map/cell/' + mapId;

	this.element.css('background-image', 'url(' + uri + ')');
	this.anim();
}
AnimCell.prototype.anim = function() {
	var pos = this.steps;

	if (pos == 3 && this.pat == 4) {
		pos = 1;
	}
	var py = this.oy + pos * 16;
	var position = -this.ox + 'px ' + -py + 'px';
	this.element.css('background-position', position);
}
AnimCell.prototype.show = function(viewX, viewY) {
	var viewOffset = $('#bg').offset();
	var top = viewOffset.top + this.y - viewY;
	var left = viewOffset.left + this.x - viewX;

	this.element.offset({ top: top, left: left });
	this.cnt = ++this.cnt % 8;
	if (this.cnt == 0) {
		this.anim();
		this.steps = ++this.steps % this.pat;
	}
}
