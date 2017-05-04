/**
 * Shooterメイン処理.
 */
document.addEventListener('DOMContentLoaded', ()=> {
	let loading = document.getElementById('loading');
	let view = document.getElementById('view');
	let repositories = [ImageManager.Instance, AudioMixer.INSTANCE, MotionManager.INSTANCE];
	let field = new Field(512, 224);
	let controller = new Controller();
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
	let gameOverPanel = document.getElementById('gameOver');
	let startGame = ()=> {
		field.startGame();
		gameOverPanel.classList.add('hidden');
	};

	gameOverPanel.addEventListener('mousedown', event => {
		startGame();
	});
	window.addEventListener('keydown', event => {
		let isGameOver = !gameOverPanel.classList.contains('hidden');
		let keys = controller.keys;

		if (isGameOver && (keys[' '] || keys['k32'])) {
			startGame();
		}
	});
	checkLoading();
});
