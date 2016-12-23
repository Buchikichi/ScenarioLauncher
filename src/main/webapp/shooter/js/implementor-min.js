function Charger(){Enemy.apply(this,arguments);this.speed=5;this.hitPoint=1;this.score=10;this.anim=new Animator(this,"enemy/charger.png",Animator.TYPE.NONE);this.routine=[new Movement(Movement.COND.Y).add(Gizmo.TYPE.AIM,Gizmo.DEST.TO_Y).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_Y),new Movement(10).add(Gizmo.TYPE.AIM,Gizmo.DEST.TO_X).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X),new Movement(1000).add(Gizmo.TYPE.OWN,Gizmo.DEST.TO)]}Charger.prototype=Object.create(Enemy.prototype);function EnmBattery(){Enemy.apply(this,arguments);this.speed=0;this.hitPoint=1;this.score=10;this.anim=new Animator(this,"enemy/battery.png",Animator.TYPE.NONE);this.base=new Image();this.base.src="img/enemy/batteryBase.png";this.routine=[new Movement().add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED,Gizmo.DEST.TO)];this.isInverse=false;if(this.field&&this.field.landform){var a=this.field.landform;var b={x:this.x,y:this.y+Landform.BRICK_WIDTH};a.hitTest(b);this.isInverse=!b.walled}}EnmBattery.prototype=Object.create(Enemy.prototype);EnmBattery.prototype._drawNormal=Enemy.prototype.drawNormal;EnmBattery.prototype.drawNormal=function(a){if(this.isInverse){if(this.radian<-Math.SQ){this.radian=Math.PI}else{if(this.radian<0){this.radian=0}}}else{if(Math.SQ<this.radian){this.radian=Math.PI}else{if(0<this.radian){this.radian=0}}}this._drawNormal(a);a.save();a.translate(this.x,this.y);if(this.isInverse){a.rotate(Math.PI)}a.drawImage(this.base,-this.hW,-this.hH);a.restore()};function EnmBouncer(){Enemy.apply(this,arguments);this.dir=this.x<=0?0:Math.PI;this.speed=2.5;this.gravity=0.1;this.reaction=0.95;this.hitPoint=3;this.score=50;this.shuttle=2;this.img.src="img/enemy/bouncer.png"}EnmBouncer.prototype=Object.create(Enemy.prototype);EnmBouncer.prototype._move=Enemy.prototype.move;EnmBouncer.prototype.move=function(a){if(this.shuttle&&(this.x<0||this.field.width+Landform.BRICK_WIDTH<this.x)){this.dir=Math.trim(this.dir+Math.PI);this.x=this.svX;this.dx=-this.dx;this.shuttle--}if(this.walled){this.x=this.svX;this.y=this.svY}return this._move(a)};EnmBouncer.prototype.drawNormal=function(b){var c=Math.abs(this.dy);var d=c<5?0.75+c/20:1;var a=this.y/d;b.save();b.translate(this.x,this.y);b.scale(1,d);b.drawImage(this.img,-this.hW,-this.hH);b.restore()};function EnmCrab(){Enemy.apply(this,arguments);this.margin=Field.HALF_WIDTH;this.gravity=0.3;this.reaction=0.4;this.speed=4;this.hitPoint=1;this.score=90;this.anim=new Animator(this,"enemy/crab.png",Animator.TYPE.X,8,1);this.routine=[new Movement(Movement.COND.X).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X),new Movement(EnmCrab.WALK).add(Gizmo.TYPE.OWN,Gizmo.DEST.RIGHT),new Movement(Movement.COND.X).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X),new Movement(EnmCrab.WALK).add(Gizmo.TYPE.CHASE,Gizmo.DEST.LEFT)]}EnmCrab.prototype=Object.create(Enemy.prototype);EnmCrab.WALK=20;function EnmDragonBody(){Enemy.apply(this,arguments);this.effectH=false;this.effectV=false;this.hitPoint=Number.MAX_SAFE_INTEGER;this.score=0;this.anim=new Animator(this,"enemy/dragonBody.png",Animator.TYPE.NONE)}EnmDragonBody.prototype=Object.create(Enemy.prototype);EnmDragonBody.prototype._recalculation=Actor.prototype.recalculation;EnmDragonBody.prototype.recalculation=function(){this._recalculation();this.minX=-this.field.width;this.minY=-this.field.height;this.maxX=this.field.width*2;this.maxY=this.field.height*2};EnmDragonBody.prototype.trigger=NOP;function EnmDragonHead(){Enemy.apply(this,arguments);if(0<this.x){this.x+=50}else{this.x-=50}this.speed=1.8;this.effectH=false;this.hitPoint=200;this.score=1000;this.radian=Math.PI;this.appears=false;this.anim=new Animator(this,"enemy/dragonHead.png",Animator.TYPE.NONE);this.locus=[];this.body=[];for(var b=0;b<EnmDragonHead.CNT_OF_BODY*EnmDragonHead.STP_OF_BODY;b++){this.locus.push({x:this.x,y:this.y,radian:this.radian});if(b%EnmDragonHead.STP_OF_BODY==0){var a=new EnmDragonBody(this.field,this.x,this.y);this.body.push(a)}}}EnmDragonHead.prototype=Object.create(Enemy.prototype);EnmDragonHead.CNT_OF_BODY=10;EnmDragonHead.STP_OF_BODY=16;EnmDragonHead.prototype._recalculation=Actor.prototype.recalculation;EnmDragonHead.prototype.recalculation=function(){this._recalculation();this.minX=-this.field.width;this.minY=-this.field.height;this.maxX=this.field.width*2;this.maxY=this.field.height*2};EnmDragonHead.prototype._eject=Actor.prototype.eject;EnmDragonHead.prototype.eject=function(){this._eject();this.body.forEach(function(a){a.hitPoint=0;a.explosion=Actor.MAX_EXPLOSION})};EnmDragonHead.prototype._move=Enemy.prototype.move;EnmDragonHead.prototype.move=function(f){var b=Math.trim(this.radian+this.closeGap(f)*1.8);this.dir=b;this.radian=b;this._move(f);for(var e=0;e<EnmDragonHead.CNT_OF_BODY;e++){var a=this.body[e];var c=(e+1)*EnmDragonHead.STP_OF_BODY-1;var d=this.locus[c];a.x=d.x;a.y=d.y;a.radian=d.radian}this.locus.unshift({x:this.x,y:this.y,radian:this.radian});this.locus.pop();if(this.appears){return}this.appears=true;return this.body};function EnmFormation(){Actor.apply(this,arguments);this.effectH=false;this.bonus=800;this.score=this.bonus;this.steps=0;this.count=0;this.enemies=[]}EnmFormation.prototype=Object.create(Actor.prototype);EnmFormation.STEP=5;EnmFormation.prototype.setup=function(c,b){for(var a=0;a<b;a++){this.enemies.push(new c(this.field,this.x,this.y))}return this};EnmFormation.prototype.checkDestroy=function(){var b=this;var a=[];this.enemies.forEach(function(c){if(c.hitPoint==0){return}a.push(c);b.x=c.x;b.y=c.y});this.enemies=a;if(a.length==0&&this.explosion==0){this.explosion=Actor.MAX_EXPLOSION*4;return}};EnmFormation.prototype._move=Actor.prototype.move;EnmFormation.prototype.move=function(a){this._move(a);if(this.enemies.length<=this.count){this.checkDestroy();return}if(this.steps++%EnmFormation.STEP!=0){return}return[this.enemies[this.count++]]};EnmFormation.prototype.drawExplosion=function(a){a.fillStyle="rgba(240, 240, 255, .8)";a.fillText(this.bonus,this.x,this.y)};function EnmHanker(){Enemy.apply(this,arguments);this.speed=1.5;this.hitPoint=2;this.score=50;this.anim=new Animator(this,"enemy/hanker.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO)]}EnmHanker.prototype=Object.create(Enemy.prototype);function EnmJerky(){Enemy.apply(this,arguments);this.speed=2;this.hitPoint=1;this.score=10;this.anim=new Animator(this,"enemy/jerky.png",Animator.TYPE.NONE);this.routine=[new Movement(Movement.COND.X).add(Gizmo.TYPE.AIM,Gizmo.DEST.TO_X).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X),new Movement(Movement.COND.Y).add(Gizmo.TYPE.AIM,Gizmo.DEST.TO_Y).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_Y)]}EnmJerky.prototype=Object.create(Enemy.prototype);function EnmJuno(){Enemy.apply(this,arguments);this.dir=Math.PI;this.speed=3;this.hitPoint=16;this.score=750;this.anim=new Animator(this,"enemy/juno.png",Animator.TYPE.NONE);this.routine=[new Movement(200).add(Gizmo.TYPE.FIXED,Gizmo.DEST.TO),new Movement(Number.MAX_VALUE).add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE)]}EnmJuno.prototype=Object.create(Enemy.prototype);EnmJuno.prototype._recalculation=Actor.prototype.recalculation;EnmJuno.prototype.recalculation=function(){this._recalculation();this.minX=-this.field.width;this.minY=-this.field.height;this.maxX=this.field.width*2;this.maxY=this.field.height*2};function EnmTentacle(d,a,e){Chain.apply(this,arguments);this.speed=1.2;this.hitPoint=16;this.appears=false;this.anim=new Animator(this,"enemy/tentacle.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO)];this.push(new EnmTentacleHead(5+EnmTentacle.MAX_JOINT));for(var b=0;b<EnmTentacle.MAX_JOINT;b++){var c=5+EnmTentacle.MAX_JOINT-b;this.push(new EnmTentacleJoint(c))}this.score=150}EnmTentacle.prototype=Object.create(Chain.prototype);EnmTentacle.MAX_JOINT=8;EnmTentacle.MAX_RADIUS=16;EnmTentacle.DEG_STEP=Math.PI/2000;EnmTentacle.prototype.eject=function(){var a=this.next;while(a){a.eject();a=a.next}this.isGone=true;this.x=-this.width};EnmTentacle.prototype._move=Enemy.prototype.move;EnmTentacle.prototype.move=function(c){this.radius=this.hitPoint/2+8;this.scale=this.radius/EnmTentacle.MAX_RADIUS;this._move(c);this.radian=this.next.radian;if(this.appears){return}this.appears=true;var a=[];var b=this.next;while(b){a.push(b);b=b.next}return a};EnmTentacle.prototype.trigger=NOP;function EnmTentacleJoint(a){Chain.apply(this,arguments);this.radius=4;this.radian=0;this.speed=a;this.anim=new Animator(this,"enemy/tentacleJoint.png",Animator.TYPE.NONE)}EnmTentacleJoint.prototype=Object.create(Chain.prototype);EnmTentacleJoint.prototype.addRadian=function(a){this.radian=Math.trim(this.radian+a);if(this.next){}return this.radian};EnmTentacleJoint.prototype.move=function(f){var c=f.x-this.x;var b=f.y-this.y;var a=Math.close(this.radian,Math.atan2(b,c),EnmTentacle.DEG_STEP*this.speed);var e=Math.trim(a-this.radian);var d=this.prev;var h=this.addRadian(e);var g=this.radius+d.radius;this.x=d.x+Math.cos(h)*g;this.y=d.y+Math.sin(h)*g};EnmTentacleJoint.prototype.fate=NOP;EnmTentacleJoint.prototype.trigger=NOP;function EnmTentacleHead(a){EnmTentacleJoint.apply(this,arguments);this.anim=new Animator(this,"enemy/tentacleHead.png",Animator.TYPE.NONE)}EnmTentacleHead.prototype=Object.create(EnmTentacleJoint.prototype);EnmTentacleHead.prototype.trigger=Enemy.prototype.trigger;function EnmWaver(){Enemy.apply(this,arguments);this.dir=this.x<=0?0:Math.PI;this.step=Math.PI/30;this.speed=4;this.score=10;this.anim=new Animator(this,"enemy/waver.png",Animator.TYPE.Y,1,8);this.routine=[new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L),new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R),new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R),new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L)]}EnmWaver.prototype=Object.create(Enemy.prototype);EnmWaver.RANGE=8;function Hatch(){Enemy.apply(this,arguments);this.z=1;this.speed=0;this.hitPoint=10;this.score=200;this.count=0;this.children=0;this.anim=new Animator(this,"enemy/hatch.png",Animator.TYPE.Y,1,2);this.isInverse=false;if(this.field&&this.field.landform){var a=this.field.landform;var b={x:this.x,y:this.y+Landform.BRICK_WIDTH};a.hitTest(b);this.isInverse=!b.walled}}Hatch.prototype=Object.create(Enemy.prototype);Hatch.IDLE=30;Hatch.INTERVAL=8;Hatch.CHILDREN=20;Hatch.prototype.enemy_move=Enemy.prototype.move;Hatch.prototype.move=function(a){this.enemy_move(a);if(this.count++<Hatch.IDLE){return}if(this.count%Hatch.INTERVAL!=0){return}if(Hatch.CHILDREN<=this.children++){return}return[new Charger(this.field,this.x,this.y)]};function Molten(){Enemy.apply(this,arguments);this.margin=Field.HALF_WIDTH;this.dir=0;this.speed=1;this.effectH=false;this.hitPoint=Number.MAX_SAFE_INTEGER;this.cycle=0;this.phase=Molten.PHASE.TARGET;this.rock=[];this.appears=false;this.anim=new Animator(this,"boss/molten.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE)]}Molten.MAX_CYCLE=500;Molten.PHASE={OWN:0,TARGET:1,length:2};Molten.prototype=Object.create(Enemy.prototype);Molten.prototype._move=Enemy.prototype.move;Molten.prototype.move=function(b){this._move(b);if(Molten.MAX_CYCLE<this.cycle++){this.cycle=0;this.phase++;this.phase%=Molten.PHASE.length}if(this.appears){this.checkDestroy(b);return[]}this.appears=true;var a=new MoltenRock(this.field,this.x,this.y,this);this.rock=[a];return[a]};Molten.prototype.checkDestroy=function(b){var a=[];this.rock.forEach(function(c){if(!c.isGone){a.push(c)}});if(a.length==0){this.hitPoint=0;this.fate(b)}this.rock=a};function MoltenRock(c,a,d,b){Enemy.apply(this,arguments);this.margin=Field.HALF_WIDTH;this.parent=b;this.dir=0;this.speed=1.3;this.hitPoint=5;this.score=10;this.anim=new Animator(this,"boss/moltenRock.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE)]}MoltenRock.prototype=Object.create(Enemy.prototype);MoltenRock.prototype._move=Enemy.prototype.move;MoltenRock.prototype.move=function(e){var a=[];var d=this.parent;if(d.phase==Molten.PHASE.OWN){a=this._move(d)}else{this._move(e)}if(this.absorbed&&this.hitPoint){var b=Math.trim(this.dir+Math.SQ);for(var c=0;c<3;c++){var f=new MoltenRock(this.field,this.x,this.y,d);f.dir=b;f.speed=this.speed*1.2;f.hitPoint=this.hitPoint;a.push(f);d.rock.push(f);b=Math.trim(b+Math.SQ)}}this.absorbed=false;return a};"use strict";function MotionManager(){Repository.apply(this,arguments)}MotionManager.prototype=Object.create(Repository.prototype);MotionManager.INSTANCE=new MotionManager();MotionManager.prototype.makeName=function(a){return"motion/"+a+".json"};function Motion(c,a,d,b){this.type=c;this.key=a;this.speed=d;this.h=b;this.v=0;this.x=0;this.y=0;this.triggerMin=Number.NaN;this.triggerMax=Number.NaN;this.reserve=null;this.filling=null;this.batter=0}Motion.TYPE={NORMAL:0,ONLY_ONE:1,REWIND:2};Motion.prototype.rotateV=function(a){this.v=a;return this};Motion.prototype.offsetX=function(a){this.x=a;return this};Motion.prototype.offsetY=function(a){this.y=a;return this};Motion.prototype.shot=function(b,c,a){this.reserve={type:b,id:c};if(isFinite(a)){this.triggerMin=a;this.triggerMax=a+this.speed}else{this.triggerMin=a.min;this.triggerMax=a.max}return this};Motion.prototype.reset=function(){this.mot=MotionManager.INSTANCE.dic[this.key];if(this.mot){this.max=this.mot.length-1}this.ix=0;this.dir=1;return this};Motion.prototype.next=function(){var a=this.ix+this.speed*this.dir;if(this.max<=a){if(this.type!=Motion.TYPE.REWIND){return null}this.ix=this.max;this.dir*=-1;return[this.mot[this.ix]]}if(a<0){return null}var b=[];while(this.ix!=a){this.ix+=this.dir;b.push(this.mot[this.ix])}this.checkTrigger();return b};Motion.prototype.checkTrigger=function(){if(this.filling){return}if(0<this.batter){this.batter=0;return}if(this.triggerMin<=this.ix&&this.ix<=this.triggerMax){this.filling=this.reserve;this.batter=1}};Motion.prototype.fire=function(){if(!this.filling){return}var a=this.filling;this.filling=null;return a};function MotionRoutine(a){this.routine=a;this.ix=0;this.max=this.routine.length-1;this.loop=0;this.current=this.routine[this.ix].reset()}MotionRoutine.prototype.next=function(e){var b=this.current.ix;var a=this.current.next();if(a==null){this.ix++;if(this.max<this.ix){this.ix=0;this.loop++}this.current=this.routine[this.ix].reset();if(0<this.loop&&this.current.type==Motion.TYPE.ONLY_ONE){this.ix++;this.current=this.routine[this.ix].reset()}a=this.current.next()}var d=this.current.ix<b?-1:1;var c=this.current.fire();e.rotationH=this.current.h;e.rotationV=this.current.v;e.offsetX=this.current.x;e.offsetY=this.current.y;e.calcRotationMatrix();a.forEach(function(f){e.shift(f,d);e.calculate()});return c};function Skeleton(a){this.data=a;this.map={};this.offsetX=0;this.offsetY=0;this.rotationH=Math.PI/4;this.rotationV=Math.PI/8;this.rotationMatrix=new Matrix(Matrix.NO_EFFECT);this.init()}Skeleton.prototype.init=function(){var a=Object.assign(new Bone(),this.data.root);this.data.root=a;this.prepare(a);this.calcRotationMatrix()};Skeleton.prototype.prepare=function(b){var c=this;var a=[];b.prepare();b.joint.forEach(function(d){d.parent=b;a.push(Object.assign(new Bone(),d))});b.joint=a;b.joint.forEach(function(d){c.prepare(d)});b.skeleton=this;this.map[b.name]=b};Skeleton.prototype.calcRotationMatrix=function(){var a=Matrix.rotateY(this.rotationH);this.rotationMatrix=Matrix.rotateX(this.rotationV).multiply(a)};Skeleton.prototype.rotateH=function(a){this.rotationH+=(Math.PI/720)*a;this.rotationH=Math.trim(this.rotationH);this.calcRotationMatrix()};Skeleton.prototype.rotateV=function(a){this.rotationV+=(Math.PI/720)*a;this.rotationV=Math.trim(this.rotationV);this.calcRotationMatrix()};Skeleton.prototype.shift=function(a,c){var b=this;a.forEach(function(n){var d=n.r;var m=b.map[n.name];var g=Matrix.rotateX(d.x);var f=Matrix.rotateY(d.y);var e=Matrix.rotateZ(d.z);m.motionMatrix=e.multiply(f).multiply(g);if(n.p){var h=n.p;var i=m.pt;var l=b.offsetX+i.x+h.x*c;var k=b.offsetY+i.y+h.y*c;var j=i.z+h.z*c;m.translateMatrix=new Matrix([[1,0,0,l],[0,1,0,k],[0,0,1,j],[0,0,0,1]])}})};Skeleton.prototype.calculate=function(a){this.data.root.calculate(a)};Skeleton.prototype.draw=function(a){this.data.root.draw(a)};function Bone(){this.pt={x:0,y:0,z:0}}Bone.prototype.prepare=function(){var j=this.translate;var i=Matrix.rotateX(this.axis.x);var g=Matrix.rotateY(this.axis.y);var f=Matrix.rotateZ(this.axis.z);var e=f.multiply(g).multiply(i);this.translateMatrix=new Matrix([[1,0,0,j.x],[0,1,0,j.y],[0,0,1,j.z],[0,0,0,1]]);if(this.parent){var h=this.parent;var c=Matrix.rotateX(-h.axis.x);var b=Matrix.rotateY(-h.axis.y);var a=Matrix.rotateZ(-h.axis.z);var d=c.multiply(b).multiply(a);this.axisMatrix=d.multiply(e)}else{this.axisMatrix=e}this.motionMatrix=new Matrix(Matrix.NO_EFFECT)};Bone.prototype.getAccum=function(){if(this.parent){var a=this.axisMatrix.multiply(this.motionMatrix).multiply(this.translateMatrix);return this.parent.getAccum().multiply(a)}return this.translateMatrix.multiply(this.motionMatrix)};Bone.prototype.calculate=function(a){this.pt=this.getAccum().affine(0,0,0);if(a){return}this.joint.forEach(function(b){b.calculate(false)})};Bone.prototype.drawLine=function(g){var d=this.parent.pt;var j=this.pt;var c=this.skeleton.rotationMatrix;d=c.affine(d.x,d.y,d.z);j=c.affine(j.x,j.y,j.z);var i=j.x;var f=-j.y;var b=d.x;var a=-d.y;var h=i-b;var e=f-a;this.cx=b+h/2;this.cy=a+e/2;this.cz=j.z;this.radian=Math.atan2(e,h);g.beginPath();g.moveTo(b,a);g.lineTo(i,f);g.stroke()};Bone.prototype.draw=function(a){this.calculate();if(this.parent){this.drawLine(a)}this.joint.forEach(function(b){b.draw(a)})};function Titan(c,a,d){Enemy.apply(this,arguments);var b=MotionManager.INSTANCE.dic.asf;this.scale=7;this.hitPoint=Number.MAX_SAFE_INTEGER;this.motionRoutine=new MotionRoutine([new Motion(Motion.TYPE.ONLY_ONE,"111_7.amc",3,Math.PI/4).offsetX(0).offsetY(0),new Motion(Motion.TYPE.NORMAL,"79_96.amc",3,-Math.PI*0.4).shot(TitanShot,["lradius","lwrist","lhand","lthumb","lfingers"],200),new Motion(Motion.TYPE.REWIND,"133_01.amc",3,Math.PI).shot(TitanBullet,["thorax","upperneck"],{min:200,max:550}),new Motion(Motion.TYPE.NORMAL,"79_91.amc",1,-Math.PI*0.4).shot(TitanBall,["rhumerus","rradius","rwrist","rhand"],{min:175,max:200}),new Motion(Motion.TYPE.NORMAL,"86_01b.amc",3,Math.PI).shot(Bullet,["lfingers","rfingers"],{min:0,max:1000})]);if(b){this.skeleton=new Skeleton(b);this.setupBone(c)}}Titan.prototype=Object.create(Enemy.prototype);Titan.HIT_POINT=292;Titan.prototype.setupBone=function(c){var b=this.skeleton.map;var a={};Object.keys(b).forEach(function(e){if(e=="root"){return}var f=new TitanBone(c,0,0);var d="boss/titan/"+e+".png";f.anim=new Animator(f,d,Animator.TYPE.NONE);if(e=="lowerback"){f.hitPoint=Titan.HIT_POINT}f.id=e;a[e]=f});this.boneMap=a;this.appears=false};Titan.prototype._eject=Actor.prototype.eject;Titan.prototype.eject=function(){var a=this;this._eject();Object.keys(this.boneMap).forEach(function(b){var c=a.boneMap[b];c.hitPoint=0;c.explosion=Actor.MAX_EXPLOSION*2})};Titan.prototype._move=Enemy.prototype.move;Titan.prototype.move=function(g){var c=[];var a=this;var f=this.skeleton;var b=this.motionRoutine.next(f);this._move(g);if(!this.appears){Object.keys(this.boneMap).forEach(function(h){c.push(a.boneMap[h])});this.appears=true;return c.reverse()}var e=this.skeleton.map;var d=false;if(b){b.id.forEach(function(j){var i=a.boneMap[j];var h=new b.type(a.field,i.x,i.y);h.dir=i.radian;c.push(h)})}Object.keys(this.boneMap).forEach(function(i){var k=e[i];var h=k.cx*a.scale+a.x;var l=k.cy*a.scale+a.y;var j=a.boneMap[i];j.x=h;j.y=l;j.z=k.cz;j.radian=k.radian;j.constraint=true;if(j.hitPoint==0){d=true}});if(d){this.eject()}return c};Titan.prototype.drawInfo=function(b){var a=this.motionRoutine.current;var c=this.boneMap.lowerback;b.save();b.translate(this.x,this.y);b.strokeStyle="rgba(255, 255, 255, 0.8)";b.strokeText("ix:"+a.ix,0,0);b.strokeText("hp:"+c.hitPoint,0,10);b.restore()};Titan.prototype.drawNormal=function(b){var a=this;b.save();b.translate(this.x,this.y);if(this.skeleton){b.scale(this.scale,this.scale);b.strokeStyle="rgba(203, 152, 135, 0.2)";this.skeleton.draw(b)}b.restore();this.drawInfo(b)};Titan.prototype.isHit=function(a){return false};function TitanBone(b,a,c){Enemy.apply(this,arguments);this.margin=Field.WIDTH;this.hitPoint=Number.MAX_SAFE_INTEGER;this.filling=null}TitanBone.prototype=Object.create(Enemy.prototype);TitanBone.prototype.trigger=NOP;function TitanBall(b,a,c){Enemy.apply(this,arguments);this.margin=Field.HALF_WIDTH;this.speed=3+Math.random()*8;this.gravity=0.04;this.hitPoint=4;this.anim=new Animator(this,"boss/titan/titan.ball.png",Animator.TYPE.NONE)}TitanBall.prototype=Object.create(Enemy.prototype);TitanBall.prototype.trigger=NOP;TitanBall.prototype._react=Enemy.prototype.react;TitanBall.prototype.react=function(){this._react();this.fate(this)};function TitanBullet(b,a,c){Enemy.apply(this,arguments);this.dir=-Math.PI+Math.SQ/2;this.radian=this.dir;this.speed=10;this.hitPoint=Number.MAX_SAFE_INTEGER;this.anim=new Animator(this,"boss/titan/titan.bullet.png",Animator.TYPE.NONE)}TitanBullet.prototype=Object.create(Enemy.prototype);function TitanShot(b,a,c){Enemy.apply(this,arguments);this.dir=Math.PI;this.radian=this.dir;this.speed=14;this.hitPoint=Number.MAX_SAFE_INTEGER;this.anim=new Animator(this,"boss/titan/titan.shot.png",Animator.TYPE.NONE)}TitanShot.prototype=Object.create(Enemy.prototype);function Winding(c,a,d){Chain.apply(this,arguments);this.dir=-Math.PI;this.step=Math.SQ/100;this.radius=Winding.RADIUS;this.speed=2.2;this.hitPoint=300;this.margin=Field.HALF_WIDTH;this.ratio=Winding.RATIO_MAX;this.delta=-1;this.uncoil=false;this.anim=new Animator(this,"boss/winding.png",Animator.TYPE.NONE);this.routine=[new Movement(200).add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE),new Movement(20).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R)];this.appears=false;for(var b=0;b<Winding.MAX_JOINT;b++){this.push(new WindingChild(c,a,d))}}Winding.prototype=Object.create(Chain.prototype);Winding.RADIUS=16;Winding.RADIAN_STEP=Math.SQ;Winding.RATIO_MAX=50;Winding.MAX_JOINT=20;Winding.prototype._move=Enemy.prototype.move;Winding.prototype.move=function(d){var b=this._move(d);var a=Math.trim(this.dir-Math.SQ/2);this.rad=Math.trim(this.dir+Math.SQ);if(this.appears){var c=this.next;while(c){a+=Winding.RADIAN_STEP*this.ratio/100;c.radian=Math.trim(a);c=c.next}if(this.uncoil){this.ratio+=this.delta;if(this.ratio<=1){this.delta*=-1}else{if(Winding.RATIO_MAX<=this.ratio){this.uncoil=false;this.delta*=-1}}}return b}this.appears=true;var c=this.next;while(c){b.push(c);c=c.next}return b};Winding.prototype._fate=Actor.prototype.fate;Winding.prototype.fate=function(a){this._fate(a);this.uncoil=true};function WindingChild(b,a,c){Chain.apply(this,arguments);this.margin=Field.HALF_WIDTH;this.effectH=false;this.radius=WindingChild.RADIUS;this.anim=new Animator(this,"boss/winding.joint.png",Animator.TYPE.NONE)}WindingChild.RADIUS=4;WindingChild.prototype=Object.create(Chain.prototype);WindingChild.prototype.move=function(b){var a=this.prev;var c=this.radius+a.radius;this.x=a.x+Math.cos(this.radian)*c;this.y=a.y+Math.sin(this.radian)*c};WindingChild.prototype.fate=NOP;WindingChild.prototype.trigger=NOP;function Cascade(d,a,e){Chain.apply(this,arguments);this.anim=new Animator(this,"material/cascade.png",Animator.TYPE.NONE);this.radian=Math.SQ;this.radius=Cascade.RADIUS;this.appears=false;for(var b=0;b<Cascade.MAX_JOINT;b++){var c=(Cascade.MAX_JOINT-b)*6;this.push(new CascadeChild(d,a,e,c))}}Cascade.prototype=Object.create(Chain.prototype);Cascade.RADIUS=4;Cascade.MAX_JOINT=12;Cascade.prototype._move=Enemy.prototype.move;Cascade.prototype.move=function(c){this._move(c);if(this.appears){return}this.appears=true;var a=[];var b=this.next;while(b){a.push(b);b=b.next}return a};Cascade.prototype.fate=NOP;Cascade.prototype.trigger=NOP;function CascadeChild(c,a,d,b){Chain.apply(this,arguments);this.maxX=this.field.width+100;this.effectH=false;this.effectV=false;this.weight=b;this.radian=Math.SQ*0.9;this.radius=Cascade.RADIUS;this.step=0}CascadeChild.prototype=Object.create(Chain.prototype);CascadeChild.prototype.addRadian=function(a){this.radian=Math.trim(this.radian+a);if(this.next){}return this.radian};CascadeChild.prototype.move=function(c){var a=this.prev;var b=Math.trim(Math.SQ-this.radian)/(200+this.weight);this.step+=b;if(parseInt(b*1000)==0){this.step*=0.98}var e=Math.trim(this.radian+this.step);var d=this.radius+a.radius;if(e<0){e=0}this.radian=e;this.x=a.x+Math.cos(e)*d;this.y=a.y+Math.sin(e)*d};CascadeChild.prototype.draw=function(a){a.save();a.fillStyle="rgba(60, 200, 0, 0.8)";a.translate(this.x,this.y);a.beginPath();a.arc(0,0,this.radius,0,Math.PI2,false);a.fill();a.restore()};CascadeChild.prototype.fate=function(b){var c=Math.PI/400;this.step-=c;var a=this.next;while(a){a.step-=c*0.8;a=a.next}};CascadeChild.prototype.trigger=NOP;function Rewinder(c,a,d){Chain.apply(this,arguments);this.step=Math.SQ/100;this.radius=Rewinder.RADIUS;this.speed=2.2;this.hitPoint=Number.MAX_SAFE_INTEGER;this.margin=Field.HALF_WIDTH;this.ratio=Rewinder.RATIO_MAX;this.delta=-0.8;this.anim=new Animator(this,"material/cascade.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED,Gizmo.DEST.TO)];this.appears=false;for(var b=0;b<Rewinder.MAX_JOINT;b++){this.push(new RewinderChild(c,a,d))}}Rewinder.prototype=Object.create(Chain.prototype);Rewinder.RADIUS=4;Rewinder.RADIAN_STEP=Math.SQ;Rewinder.RATIO_MAX=100;Rewinder.MAX_JOINT=16;Rewinder.prototype._move=Enemy.prototype.move;Rewinder.prototype.move=function(d){var b=[];var a=Math.trim(this.radian+Math.SQ/2);this._move(d);if(this.appears){var c=this.next;while(c){a-=Rewinder.RADIAN_STEP*this.ratio/100;c.radian=Math.trim(a);c=c.next}this.ratio+=this.delta;if(this.ratio<=1){this.delta*=-1}else{if(Rewinder.RATIO_MAX<=this.ratio){this.delta*=-1}}return b}this.appears=true;var c=this.next;while(c){b.push(c);c=c.next}return b};Rewinder.prototype.fate=NOP;function RewinderChild(b,a,c){Chain.apply(this,arguments);this.margin=Field.HALF_WIDTH;this.effectH=false;this.effectV=false;this.radius=RewinderChild.RADIUS;this.anim=new Animator(this,"boss/winding.joint.png",Animator.TYPE.NONE)}RewinderChild.RADIUS=4;RewinderChild.prototype=Object.create(Chain.prototype);RewinderChild.prototype.move=function(b){var a=this.prev;var c=this.radius+a.radius;this.x=a.x+Math.cos(this.radian)*c;this.y=a.y+Math.sin(this.radian)*c};RewinderChild.prototype.fate=NOP;Enemy.LIST=[{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Battery",type:EnmBattery,img:"enemy/battery.png"},{name:"Bouncer",type:EnmBouncer,img:"enemy/bouncer.png"},{name:"Hanker",type:EnmHanker,img:"enemy/hanker.png"},{name:"Jerky",type:EnmJerky,img:"enemy/jerky.png"},{name:"Juno",type:EnmJuno,img:"enemy/juno.png"},{name:"Crab",type:EnmCrab,img:"enemy/crab.png"},{name:"Hatch",type:Hatch,img:"enemy/hatch.png",h:16},{name:"Charger",type:Charger,img:"enemy/charger.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Waver",type:EnmWaver,img:"enemy/waver.png",h:16},{name:"Tentacle",type:EnmTentacle,img:"enemy/tentacle.png"},{name:"Dragon",type:EnmDragonHead,img:"enemy/dragonHead.png"},{name:"Waver(formation)",type:EnmWaver,img:"enemy/waver.png",h:16,formation:true},{name:"Molten",type:Molten,img:"boss/molten.png"},{name:"Winding",type:Winding,img:"boss/winding.png"},{name:"Titan",type:Titan,img:"boss/titan.icon.png"},{name:"Cascade",type:Cascade,img:"material/cascade.icon.png"},{name:"Rewinder",type:Rewinder,img:"material/cascade.icon.png"}];Stage.LIST=[new Stage(Stage.SCROLL.OFF,"stage00map.png",[new StageBg("stage01bg0.png",0.7),new StageBg("stage01bg1.png",0.9,0,0.02),new StageFg("stage00bg.png")]).setBgm("bgm-edo-beth"),new Stage(Stage.SCROLL.OFF,"stage01map.png",[new StageBg("stage01bg1.png",0.7,0,0.02),new StageBg("stage01bg0.png",0.6),new StageFg("stage01bg.png",1.3)]).setBgm("bgm-MadNightDance","bgm-edo-omega-zero"),new Stage(Stage.SCROLL.LOOP,"stage00map.png",[new StageBg("stage01bg0.png",0.7),new StageBg("stage01bg1.png",0.9,0,0.02),new StageFg("stage00bg.png")]).setBgm("bgm-edo-beth"),new Stage(Stage.SCROLL.ON,"stage02map.png",[new StageBg("stage01bg1.png",0.7),new StageBg("stage01bg0.png",0.9),new StageFg("stage02bg.png")]).setBgm("bgm-pierrot-cards","bgm-edo-omega-zero"),new Stage(Stage.SCROLL.OFF,"stage1.map.png",[new StageBg("stage01bg1.png",0.7),new StageBg("stage01bg0.png",0.9),new StageFg("stage1.1.0.png",1.3)]).setBgm("bgm-ThroughTheDark","bgm-edo-omega-zero"),new Stage(Stage.SCROLL.ON,"stage2.map.png",[new StageBg("stage2.1.1.png",0.7),new StageBg("stage01bg1.png",2,-Math.SQ/2),new StageFg("stage2.1.0.png")]).setBgm("bgm-pierrot-cards","bgm-edo-omega-zero"),new Stage(Stage.SCROLL.OFF,"stage3.map.png",[new StageBg("stage01bg1.png",0.7),new StageFg("stage3.1.1.png",1,0,0.02),new StageFg("stage3.1.0.png")]).setBgm("bgm-YourDream-R","bgm-edo-omega-zero"),new Stage(Stage.SCROLL.LOOP,"stage4.map.png",[new StageBg("stage01bg1.png",0.7),new StageFg("stage01bg0.png",1,0,0.02),new StageFg("stage4.1.0.png")]).setBgm("bgm-pierrot-cards","bgm-edo-omega-zero")];AudioMixer.INSTANCE.reserve(["sfx-fire","sfx-explosion","sfx-absorb"]);MotionManager.INSTANCE.reserve(["asf","79_91.amc","79_96.amc","86_01b.amc","111_7.amc","133_01.amc"]);