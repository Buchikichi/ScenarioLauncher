/**
 * Controller.
 */
class Controller {
	constructor(isEdit = false) {
		this.keys = {};
		this.point = {};
		this.touch = false;
		this.init(isEdit);
		Controller.Instance = this;
	}

	init(isEdit) {
		if (!isEdit) {
			window.addEventListener('contextmenu', event => {
				event.preventDefault();
			});
		}
		this.initKeys();
		this.initPointingDevice();
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
		let end = ()=> {
			this.touch = false;
			this.point = null;
//console.log('end');
		};

		canvas.addEventListener('mousedown', event => {
			this.touch = true;
			this.point = FlexibleView.Instance.convert(event.clientX, event.clientY);
		});
		canvas.addEventListener('mousemove', event => {
			if (this.touch) {
				this.point = FlexibleView.Instance.convert(event.clientX, event.clientY);
			}
		});
		canvas.addEventListener('mouseup', ()=> end());
		canvas.addEventListener('mouseleave', ()=> end());

		// touch
		canvas.addEventListener('touchstart', event => {
			let touch = event.touches[0];

			this.touch = true;
			this.point = FlexibleView.Instance.convert(touch.pageX, touch.pageY);
//console.log('touchstart:' + this.point);
			event.preventDefault();
		});
		canvas.addEventListener('touchmove', event => {
			let touch = event.touches[0];

			this.touch = true;
			this.point = FlexibleView.Instance.convert(touch.pageX, touch.pageY);
//console.log('touchmove:' + this.point);
		});
		canvas.addEventListener('touchend', ()=> end());
	}
}
