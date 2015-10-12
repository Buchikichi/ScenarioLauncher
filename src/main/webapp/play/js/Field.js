/**
 * Field.
 */
function Field(mapId) {
	this.id = mapId;
	this.protagonist = new Actor('protagonist', 'chr001');
	this.loadImage();
	this.loadMap();
}
Field.prototype.BRICK_WIDTH = 16;
Field.prototype.SCROLL_WIDTH = Field.prototype.BRICK_WIDTH * 4;
Field.prototype.SCROLL_HEIGHT = Field.prototype.BRICK_WIDTH * 2;

Field.prototype.loadImage = function() {
	var bg = $('#bg');
	var upstairs = $('#upstairs');
	var bgUri = '/map/background/' + this.id;
	var stUri = '/map/upstairs/' + this.id;

	bg.css('background-image', 'url(' + bgUri + ')');
	upstairs.css('background-image', 'url(' + stUri + ')');
}
Field.prototype.loadMap = function() {
	var field = this;

	$.ajax('/map/', {
		'type': 'POST',
		'data': {'mapId':this.id},
		'success': function(data) {
			var wall = data.wall;
			var pos = data.pos;
			var events = {};

			$.each(data.eventList, function(ix, ev) {
				events[ev.position] = ev.eventNum;
			});
			field.height = wall.length;
			field.width = wall[0].length;
			field.wall = wall;
			field.events = events;
			// protagonist
			field.protagonist.x = pos.x;
			field.protagonist.y = pos.y;
			field.protagonist.d = 0; // direction
			field.protagonist.s = 0; // step
field.protagonist.x = 7; // TODO 削除
field.protagonist.y = 14; // TODO 削除
			// view
			field.viewX = 0;
			field.viewY = 0;
			field.viewZ = 0;
		}
	});
}
Field.prototype.hitWall = function(x, y) {
	var divisor = this.BRICK_WIDTH / this.protagonist.STRIDE;
	var lx = parseInt(x / divisor);
	var rx = parseInt((x + 3) / divisor);
	var ty = parseInt(y / divisor) + 1;
	var by = parseInt((y + 1) / divisor) + 1;

	if (this.width - 1 < rx || this.height < by) {
		return true;
	}
	var brickTL = this.wall[ty][lx];
	var brickTR = this.wall[ty][rx];
	var brickBL = this.wall[by][lx];
	var brickBR = this.wall[by][rx];

	return brickTL == 1 || brickTR == 1 || brickBL == 1 || brickBR == 1;
}
Field.prototype.getEvent = function(x, y) {
	var divisor = this.BRICK_WIDTH / this.protagonist.STRIDE;
	var lx = parseInt(x / divisor);
	var ty = parseInt(y / divisor);
	var position = lx + '-' + ty;

	return this.events[position];
}
Field.prototype.scroll = function() {
	var view = $('#view');
	var top = (this.protagonist.y - this.viewY) * this.protagonist.STRIDE + this.BRICK_WIDTH;
	var left = (this.protagonist.x - this.viewX) * this.protagonist.STRIDE + this.BRICK_WIDTH;
	var centerX = view.width() / 2;
	var centerY = view.height() / 2;
	var dx = left - centerX;
	var dy = top - centerY;

	if (this.SCROLL_WIDTH < Math.abs(dx)) {
		if (0 < this.viewX && dx < 0) {
			this.viewX--;
		} else if (0 < dx) {
			this.viewX++;
		}
	}
	if (this.SCROLL_HEIGHT < Math.abs(dy)) {
		if (0 < this.viewY && dy < 0) {
			this.viewY--;
		} else if (0 < dy) {
			this.viewY++;
		}
	}
}
