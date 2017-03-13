/**
 * Shooterメイン処理.
 */
document.addEventListener('DOMContentLoaded', function() {
	let loading = document.getElementById('loading');
	let view = document.getElementById('view');
	let repositories = [AudioMixer.INSTANCE, MotionManager.INSTANCE];
	let field = new Field(512, 224);
	let keys = {};

	window.addEventListener('resize', function(event) {
		field.resize();
	});
	window.addEventListener('keydown', function(event) {
		if (event.key) {
//console.log('key[' + event.key + ']');
			keys[event.key] = true;
		} else {
			keys['k' + event.keyCode] = true;
		}
		if (!view.classList.contains('addicting')) {
			view.classList.add('addicting');
		}
	});
	window.addEventListener('keyup', function(event) {
		if (event.key) {
			delete keys[event.key];
		} else {
			delete keys['k' + event.keyCode];
		}
	});
	let which = 0;
	let start = function(e) {
		let isMouse = e.type.match(/^mouse/);
		let tx;
		let ty;

		if (field.isGameOver() && !document.getElementById('loading')) {
			field.startGame();
			return;
		}
		if (isMouse) {
			tx = e.offsetX;
			ty = e.offsetY;
		} else if (e.originalEvent.touches) {
			let touches = e.originalEvent.touches[0];
			tx = touches.pageX;
			ty = touches.pageY;
		}
		field.moveShipTo({x:tx, y:ty});
		which = e.which;
	};
	let touch = function(e) {
		let isMouse = e.type.match(/^mouse/);
		let tx;
		let ty;

		view.classList.remove('addicting');
		if (isMouse) {
			if (!which) {
				return;
			}
			tx = e.offsetX;
			ty = e.offsetY;
		} else if (e.originalEvent.touches) {
			let touches = e.originalEvent.touches[0];
			tx = touches.pageX;
			ty = touches.pageY;
		}
		field.moveShipTo({x:tx, y:ty});
	};
	let end = function(e) {
		field.moveShipTo(null);
		which = 0;
	};
	view.addEventListener('mousedown', start);
	view.addEventListener('mousemove', touch);
	view.addEventListener('mouseleave', end);
	view.addEventListener('mouseup', end);
	view.addEventListener('touchstart', start);
	view.addEventListener('touchmove', touch);
	view.addEventListener('touchend', end);

	let activate = function() {
		let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		field.inkey(keys);
		field.scroll();
		field.draw();
		requestAnimationFrame(activate);
	};
	let checkLoading = function() {
		let loaded = 0;
		let max = 0;
		let isComplete = true;

		repositories.forEach(function(repo) {
			loaded += repo.loaded;
			max += repo.max;
			isComplete &= repo.isComplete();
		});
		let msg = loaded + '/' + max;

		loading.innerHTML = msg;
		if (isComplete) {
			loading.parentNode.removeChild(loading);
			activate();
			return;
		}
		setTimeout(checkLoading, 1000);
	};
	checkLoading();
});
