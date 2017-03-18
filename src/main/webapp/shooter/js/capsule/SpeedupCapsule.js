class SpeedupCapsule extends Capsule {
	constructor(target) {
		super(target);
		this.anim = new Animator(this, 'capsule/speedupCapsule.png', Animator.TYPE.Y);
	}

	fate(target) {
		target.speedup();
		this.eject();
	}
}
