function Chain(x, y) {
	Esse.apply(this, arguments);
	this.prev = null;
	this.next = null;
}
Chain.prototype = Object.create(Esse.prototype);

Chain.prototype.unshift = function(element) {
	element.next = this;
	element.prev = this.prev;
	if (this.prev) {
		this.prev.next = element;
	}
	this.prev = element;
	return this;
};

Chain.prototype.push = function(element) {
	element.prev = this;
	element.next = this.next;
	if (this.next) {
		this.next.prev = element;
	}
	this.next = element;
	return this;
};

Chain.prototype.remove = function() {
	this.prev.next = this.next;
	this.next.prev = this.prev;
	return this.next;
};

Chain.prototype.drawContact = function(ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, .5, 0, Math.PI * 2, false);
	ctx.stroke();
};
