document.addEventListener('DOMContentLoaded', ()=> {
	let win = $(window);
	let keys = {};
	let body = $('body');
	let field = new Field(512, 224);
	let which = 0;
	let canvas = $('#canvas');
	let activate = ()=> {
		let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		field.draw();
		requestAnimationFrame(activate);
	}

	new Controller();
	win.resize(()=> {
		let body = $('body');
		let header = $('#header');
		let height = body.height() - header.outerHeight(true);
		let magniH = body.width() / field.width;
		let magniV = height / field.height;
		let magni = Math.min(magniH, magniV);

		field.resize(magni);
	});
	win.resize();
	activate();
});
