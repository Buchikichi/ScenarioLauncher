class MissileCapsule extends Capsule {
	constructor(target) {
		super(target);
		this.anim = new Animator(this, 'capsule/missileCapsule.png', Animator.TYPE.Y);
	}

	fate(target) {
		target.powerUpMissile();
		this.eject();
	}
}
