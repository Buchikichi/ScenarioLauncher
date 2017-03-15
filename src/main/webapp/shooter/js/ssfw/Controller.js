/**
 * Controller.
 */
class Controller {
	constructor() {
		this.keys = {};
		this.point = {};
		this.touch = false;
		this.init();
		Controller.Instance = this;
	}

	init() {
		window.addEventListener('contextmenu', event => {
			event.preventDefault();
		});
		this.initKeys();
		this.initPointingDevice();
		this.initGameOverPanel();
	}

	initKeys() {
		window.addEventListener('keydown', event => {
			if (event.key) {
//console.log('key[' + event.key + ']');
				this.keys[event.key] = true;
			} else {
				this.keys['k' + event.keyCode] = true;
			}
		});
		window.addEventListener('keyup', event => {
			if (event.key) {
				delete this.keys[event.key];
			} else {
				delete this.keys['k' + event.keyCode];
			}
		});
	}

	initPointingDevice() {
		let canvas = document.getElementById('canvas');
		let point = (x, y)=> {
			let field = Field.Instance;

			if (field) {
				let scale = field.scale;

				this.point = {
					x: x / scale,
					y: y / scale
				};
			}
		};
		let end = ()=> {
			this.touch = false;
			this.point = null;
//console.log('end');
		};

		canvas.addEventListener('mousedown', event => {
			this.touch = true;
			this.point = {
				x: event.offsetX,
				y: event.offsetY
			};
		});
		canvas.addEventListener('mousemove', event => {
			if (this.touch) {
				this.point = {
						x: event.offsetX,
						y: event.offsetY
					};
			}
		});
		canvas.addEventListener('mouseup', ()=> end());
		canvas.addEventListener('mouseleave', ()=> end());

		// touch
		canvas.addEventListener('touchstart', event => {
			let touch = event.touches[0];

			this.touch = true;
			point(touch.pageX, touch.pageY);
//console.log('touchstart:' + this.point);
			event.preventDefault();
		});
		canvas.addEventListener('touchmove', event => {
			let touch = event.touches[0];

			this.touch = true;
			point(touch.pageX, touch.pageY);
//console.log('touchmove:' + this.point);
		});
		canvas.addEventListener('touchend', ()=> end());
	}

	initGameOverPanel() {
		let gameOver = document.getElementById('gameOver');
		let startGame = ()=> {
			Field.Instance.startGame();
			gameOver.classList.add('hidden');
		};

		gameOver.addEventListener('mousedown', event => {
//console.log('gameOver:mousedown');
			startGame();
		});
		window.addEventListener('keydown', event => {
			let isGameOver = !gameOver.classList.contains('hidden');

			if (isGameOver && (this.keys[' '] || this.keys['k32'])) {
				startGame();
			}
		});
	}
}
