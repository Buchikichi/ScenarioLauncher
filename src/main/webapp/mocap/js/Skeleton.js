/**
 * Skeleton.
 * @author Hidetaka Sasai
 */
function Skeleton(data) {
	this.data = data;
	this.map = {};
	this.offsetX = 0;
	this.offsetY = 0;
	this.rotationH = Math.PI / 4;
	this.rotationV = Math.PI / 8;
	this.rotationMatrix = new Matrix(Matrix.NO_EFFECT);
	this.init();
}

Skeleton.prototype.init = function() {
	var root = Object.assign(new Bone(), this.data.root);

	this.data.root = root;
	this.prepare(root);
	this.calcRotationMatrix();
};

Skeleton.prototype.prepare = function(node) {
	var skeleton = this;
	var children = [];

	node.prepare();
	node.joint.forEach(function(child) {
		child.parent = node;
		children.push(Object.assign(new Bone(), child));
	});
	node.joint = children;
	node.joint.forEach(function(child) {
		skeleton.prepare(child);
	});
	node.skeleton = this;
	this.map[node.name] = node;
};

Skeleton.prototype.calcRotationMatrix = function() {
	var mh = Matrix.rotateY(this.rotationH);

	this.rotationMatrix = Matrix.rotateX(this.rotationV).multiply(mh);
};

Skeleton.prototype.rotateH = function(diff) {
	this.rotationH += (Math.PI / 720) * diff;
	this.rotationH = Math.trim(this.rotationH);
	this.calcRotationMatrix();
};

Skeleton.prototype.rotateV = function(diff) {
	this.rotationV += (Math.PI / 720) * diff;
	this.rotationV = Math.trim(this.rotationV);
	this.calcRotationMatrix();
};

Skeleton.prototype.shift = function(motionList, direction) {
	var skeleton = this;

	motionList.forEach(function(motion) {
		var r = motion.r;
		var bone = skeleton.map[motion.name];
		var rx = Matrix.rotateX(r.x);
		var ry = Matrix.rotateY(r.y);
		var rz = Matrix.rotateZ(r.z);

		bone.motionMatrix = rz.multiply(ry).multiply(rx);
		if (motion.p) {
			// root
			var p = motion.p;
			var prev = bone.pt;
			var x = skeleton.offsetX + prev.x + p.x * direction;
			var y = skeleton.offsetY + prev.y + p.y * direction;
			var z = prev.z + p.z * direction;

			bone.translateMatrix = new Matrix([[1,0,0,x],[0,1,0,y],[0,0,1,z],[0,0,0,1]]);
		}
	});
};

Skeleton.prototype.calculate = function(isSimple) {
	this.data.root.calculate(isSimple);
};

Skeleton.prototype.draw = function(ctx) {
	this.data.root.draw(ctx);
};


/**
 * Bone.
 * @author Hidetaka Sasai
 */
function Bone() {
	this.pt = {x:0, y:0, z:0};
}

Bone.prototype.prepare = function() {
	var t = this.translate;
	var mx = Matrix.rotateX(this.axis.x);
	var my = Matrix.rotateY(this.axis.y);
	var mz = Matrix.rotateZ(this.axis.z);
	var am = mz.multiply(my).multiply(mx);

	this.translateMatrix = new Matrix([[1,0,0,t.x],[0,1,0,t.y],[0,0,1,t.z],[0,0,0,1]]);
	if (this.parent) {
		var parent = this.parent;
		var rx = Matrix.rotateX(-parent.axis.x);
		var ry = Matrix.rotateY(-parent.axis.y);
		var rz = Matrix.rotateZ(-parent.axis.z);
		var pm = rx.multiply(ry).multiply(rz);

		this.axisMatrix = pm.multiply(am);
	} else {
		this.axisMatrix = am;
	}
	this.motionMatrix = new Matrix(Matrix.NO_EFFECT);
};

Bone.prototype.getAccum = function() {
	if (this.parent) {
		var mat = this.axisMatrix.multiply(this.motionMatrix).multiply(this.translateMatrix);

		return this.parent.getAccum().multiply(mat);
	}
	return this.translateMatrix.multiply(this.motionMatrix);
};

Bone.prototype.calculate = function(isSimple) {
	this.pt = this.getAccum().affine(0, 0, 0);
	if (isSimple) {
		return;
	}
	this.joint.forEach(function(child) {
		child.calculate(false);
	});
};

Bone.prototype.drawLine = function(ctx) {
	var prevPt = this.parent.pt;
	var nextPt = this.pt;
	var mx = this.skeleton.rotationMatrix;

	prevPt = mx.affine(prevPt.x, prevPt.y, prevPt.z);
	nextPt = mx.affine(nextPt.x, nextPt.y, nextPt.z);
	var nextX = nextPt.x;
	var nextY = -nextPt.y;
	var prevX = prevPt.x;
	var prevY = -prevPt.y;
	var dx = nextX - prevX;
	var dy = nextY - prevY;

	this.cx = prevX + dx / 2;
	this.cy = prevY + dy / 2;
	this.cz = nextPt.z;
	this.radian = Math.atan2(dy, dx);
	ctx.beginPath();
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(nextX, nextY);
	ctx.stroke();
};

Bone.prototype.draw = function(ctx) {
	this.calculate();
	if (this.parent) {
		this.drawLine(ctx);
	}
	this.joint.forEach(function(child) {
		child.draw(ctx);
	});
};
