/**
 * Skeleton.
 * @author Hidetaka Sasai
 */
function Skeleton(data) {
	this.data = data;
	this.rotationH = 0;
	this.rotationV = 0;
	this.init();
}

Skeleton.prototype.init = function() {
	var root = Object.assign(new Bone(), this.data.root);

	this.data.root = root;
	this.prepare(root);
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
};

Skeleton.prototype.rotateH = function(diff) {
	this.rotationH += (Math.PI / 720) * diff;
	this.rotationH = Math.trim(this.rotationH);
};

Skeleton.prototype.rotateV = function(diff) {
	this.rotationV += (Math.PI / 720) * diff;
	this.rotationV = Math.trim(this.rotationV);
};

Skeleton.prototype.draw = function(ctx) {
	this.data.root.draw(ctx);
};


/**
 * Bone.
 * @author Hidetaka Sasai
 */
function Bone() {
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
};

Bone.prototype.getAccum = function() {
	var mat = this.axisMatrix.multiply(this.translateMatrix);

	if (this.parent) {
		return this.parent.getAccum().multiply(mat);
	}
	return mat;
};

Bone.prototype.drawLine = function(ctx) {
	var sc = 5;
	var mh = Matrix.rotateY(this.skeleton.rotationH);
	var mx = Matrix.rotateX(this.skeleton.rotationV).multiply(mh);
	var prevPt = this.parent.pt;
	var nextPt = this.pt;

	prevPt = mx.affine(prevPt.x, prevPt.y, prevPt.z);
	nextPt = mx.affine(nextPt.x, nextPt.y, nextPt.z);
	var nextX = nextPt.x * sc;
	var nextY = -nextPt.y * sc;
	var prevX = prevPt.x * sc;
	var prevY = -prevPt.y * sc;

	ctx.beginPath();
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(nextX, nextY);
	ctx.stroke();
};

Bone.prototype.draw = function(ctx) {
	this.pt = this.getAccum().affine(0, 0, 0);
	if (this.parent) {
		this.drawLine(ctx);
	}
	this.joint.forEach(function(child) {
		child.draw(ctx);
	});
};
