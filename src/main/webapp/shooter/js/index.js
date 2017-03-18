/**
 * Shooterメイン処理.
 */
document.addEventListener('DOMContentLoaded', ()=> {
	let loading = document.getElementById('loading');
	let view = document.getElementById('view');
	let repositories = [ImageManager.Instance, AudioMixer.INSTANCE, MotionManager.INSTANCE];
	let field = new Field(512, 224);

	new Controller();
	window.addEventListener('resize', ()=> {
		field.resize();
	});
	window.addEventListener('keydown', ()=> {
		if (!view.classList.contains('addicting')) {
			view.classList.add('addicting');
		}
	});
	window.addEventListener('mousemove', ()=> {
		view.classList.remove('addicting');
	});

	let activate = ()=> {
		let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		field.move();
		field.draw();
		requestAnimationFrame(activate);
	};
	let checkLoading = ()=> {
		let loaded = 0;
		let max = 0;
		let isComplete = true;

		repositories.forEach(repo => {
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
		setTimeout(checkLoading, 125);
	};
	checkLoading();
});
