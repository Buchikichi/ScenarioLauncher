var $jscomp={scope:{},inherits:function(a,b){function c(){}c.prototype=b.prototype;a.prototype=new c;a.prototype.constructor=a;for(var d in b)if(Object.defineProperties){var e=Object.getOwnPropertyDescriptor(b,d);e&&Object.defineProperty(a,d,e)}else a[d]=b[d]},getGlobal:function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a}};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(c.get||c.set)throw new TypeError("ES3 does not support getters and setters.");a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};$jscomp.polyfill=function(a,b,c,d){if(b){c=$jscomp.global;a=a.split(".");for(d=0;d<a.length-1;d++){var e=a[d];e in c||(c[e]={});c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};
$jscomp.polyfill("Number.MAX_SAFE_INTEGER",function(){return 9007199254740991},"es6-impl","es3");$jscomp.owns=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)};$jscomp.polyfill("Object.assign",function(a){return a?a:function(a,c){for(var b=1;b<arguments.length;b++){var e=arguments[b];if(e)for(var f in e)$jscomp.owns(e,f)&&(a[f]=e[f])}return a}},"es6-impl","es3");$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.symbolCounter_=0;$jscomp.Symbol=function(a){return $jscomp.SYMBOL_PREFIX+(a||"")+$jscomp.symbolCounter_++};
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.arrayIterator(this)}});$jscomp.initSymbolIterator=function(){}};$jscomp.arrayIterator=function(a){var b=0;return $jscomp.iteratorPrototype(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})};
$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};$jscomp.array=$jscomp.array||{};$jscomp.iteratorFromArray=function(a,b){$jscomp.initSymbolIterator();a instanceof String&&(a+="");var c=0,d={next:function(){if(c<a.length){var e=c++;return{value:b(e,a[e]),done:!1}}d.next=function(){return{done:!0,value:void 0}};return d.next()}};d[Symbol.iterator]=function(){return d};return d};
$jscomp.polyfill("Array.prototype.keys",function(a){return a?a:function(){return $jscomp.iteratorFromArray(this,function(a){return a})}},"es6-impl","es3");$jscomp.polyfill("Array.prototype.fill",function(a){return a?a:function(a,c,d){var b=this.length||0;0>c&&(c=Math.max(0,b+c));if(null==d||d>b)d=b;d=Number(d);0>d&&(d=Math.max(0,b+d));for(c=Number(c||0);c<d;c++)this[c]=a;return this}},"es6-impl","es3");
var Battery=function(a,b){a=Enemy.call(this,a,b)||this;a.speed=0;a.hitPoint=1;a.score=10;a.anim=[new Animator(a,"enemy/battery.png"),new Animator(a,"enemy/batteryBase.png",Animator.TYPE.NONE)];a.routine=[(new Movement).add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED,Gizmo.DEST.TO)];a.isInverse=!1;if((b=Field.Instance)&&b.landform){var c={x:a.x,y:a.y+Landform.BRICK_WIDTH};b.landform.hitTest(c);a.isInverse=!c.walled}return a};$jscomp.inherits(Battery,Enemy);
Battery.prototype.drawNormal=function(a){this.isInverse?this.radian<-Math.SQ?this.radian=Math.PI:0>this.radian&&(this.radian=0):Math.SQ<this.radian?this.radian=Math.PI:0<this.radian&&(this.radian=0);Enemy.prototype.drawNormal.call(this,a)};var Bouncer=function(a,b){a=Enemy.call(this,a,b)||this;a.dir=0>=a.x?0:Math.PI;a.speed=2;a.gravity=.1;a.reaction=.95;a.hitPoint=3;a.score=500;a.shuttle=2;a.img.src="img/enemy/bouncer.png";return a};$jscomp.inherits(Bouncer,Enemy);
Bouncer.prototype.move=function(a){this.shuttle&&(0>this.x||Field.Instance.width+Landform.BRICK_WIDTH<this.x)&&(this.dir=Math.trim(this.dir+Math.PI),this.x=this.svX,this.shuttle--);this.walled&&(this.x=this.svX,this.y=this.svY);return Enemy.prototype.move.call(this,a)};Bouncer.prototype.drawNormal=function(a){var b=Math.abs(this.dy),b=5>b?.75+b/20:1;a.save();a.scale(1,b);a.drawImage(this.img,-this.hW,-this.hH);a.restore();Enemy.prototype.drawNormal.call(this,a)};
var Charger=function(a,b){a=Enemy.call(this,a,b)||this;a.speed=2.5;a.hitPoint=1;a.score=10;a.anim=new Animator(a,"enemy/charger.png");a.routine=[(new Movement(Movement.COND.Y)).add(Gizmo.TYPE.AIM,Gizmo.DEST.TO_Y).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_Y),(new Movement(10)).add(Gizmo.TYPE.AIM,Gizmo.DEST.TO_X).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X),(new Movement(1E3)).add(Gizmo.TYPE.OWN,Gizmo.DEST.TO)];return a};$jscomp.inherits(Charger,Enemy);
var Crab=function(a,b){a=Enemy.call(this,a,b)||this;a.hasBounds=!1;a.gravity=.3;a.reaction=.4;a.speed=2;a.hitPoint=1;a.score=90;a.anim=new Animator(a,"enemy/crab.png",Animator.TYPE.X|Animator.TYPE.ROTATION,8,1);a.routine=[(new Movement(Movement.COND.X)).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X),(new Movement(Crab.WALK)).add(Gizmo.TYPE.OWN,Gizmo.DEST.RIGHT),(new Movement(Movement.COND.X)).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X),(new Movement(Crab.WALK)).add(Gizmo.TYPE.CHASE,Gizmo.DEST.LEFT)];return a};
$jscomp.inherits(Crab,Enemy);Crab.WALK=20;var DragonBody=function(a,b){a=Enemy.call(this,a,b)||this;a.region=new Region(a,16);a.hasBounds=!1;a.effectH=!1;a.effectV=!1;a.hitPoint=Number.MAX_SAFE_INTEGER;a.score=0;a.anim=new Animator(a,"enemy/dragonBody.png");return a};$jscomp.inherits(DragonBody,Enemy);$jscomp.global.Object.defineProperties(DragonBody.prototype,{triggered:{configurable:!0,enumerable:!0,get:function(){return!1}}});
var DragonHead=function(a,b){a=Enemy.call(this,a,b)||this;a.region=new Region(a,16);a.x=0<a.x?a.x+50:a.x-50;a.hasBounds=!1;a.speed=.9;a.effectH=!1;a.hitPoint=200;a.score=1E4;a.radian=Math.PI;a.appears=!1;a.anim=new Animator(a,"enemy/dragonHead.png");a.locus=[];a.body=[];for(b=0;b<DragonHead.CNT_OF_BODY*DragonHead.STP_OF_BODY;b++)if(a.locus.push({x:a.x,y:a.y,radian:a.radian}),0==b%DragonHead.STP_OF_BODY){var c=new DragonBody(a.x,a.y);a.body.push(c)}a.chamberList=[new Chamber(TitanShot,80,1)];return a};
$jscomp.inherits(DragonHead,Enemy);DragonHead.prototype.eject=function(){Enemy.prototype.eject.call(this);this.body.forEach(function(a){a.hitPoint=0;a.explosion=Actor.MAX_EXPLOSION})};
DragonHead.prototype.move=function(a){var b=this,c=Math.trim(this.radian+.9*this.closeGap(a));this.radian=this.dir=c;Enemy.prototype.move.call(this,a);this.chamberList.forEach(function(a){a.probe()});for(a=0;a<DragonHead.CNT_OF_BODY;a++){var c=this.body[a],d=this.locus[(a+1)*DragonHead.STP_OF_BODY-1];c.x=d.x;c.y=d.y;c.radian=d.radian}this.locus.unshift({x:this.x,y:this.y,radian:this.radian});this.locus.pop();if(this.appears){var e=[];this.chamberList.forEach(function(a){if(a=a.fire(b))a.dir=b.dir,
a.radian=b.dir,e.push(a)});return e}this.appears=!0;return this.body};DragonHead.CNT_OF_BODY=10;DragonHead.STP_OF_BODY=32;ImageManager.Instance.reserve(["enemy/dragonHead.png","enemy/dragonBody.png"]);var Hanker=function(a,b){a=Enemy.call(this,a,b)||this;a.speed=.7;a.hitPoint=2;a.score=50;a.anim=new Animator(a,"enemy/hanker.png");a.routine=[(new Movement).add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO)];return a};$jscomp.inherits(Hanker,Enemy);
var Hatch=function(a,b){a=Enemy.call(this,a,b)||this;a.region=new Region(a,12);a.speed=0;a.hitPoint=10;a.score=200;a.count=0;a.children=0;a.anim=new Animator(a,"enemy/hatch.png",Animator.TYPE.Y,1,2);a.isInverse=!1;if((b=Field.Instance)&&b.landform){var c={x:a.x,y:a.y+Landform.BRICK_WIDTH};b.landform.hitTest(c);a.isInverse=!c.walled}return a};$jscomp.inherits(Hatch,Enemy);
Hatch.prototype.move=function(a){Enemy.prototype.move.call(this,a);if(!(this.count++<Hatch.IDLE||0!=this.count%Hatch.INTERVAL||Hatch.CHILDREN<=this.children++||0<this.explosion))return[new Charger(this.x,this.y)]};Hatch.IDLE=80;Hatch.INTERVAL=12;Hatch.CHILDREN=20;
var Jerky=function(a,b){a=Enemy.call(this,a,b)||this;a.speed=1;a.hitPoint=1;a.score=10;a.anim=new Animator(a,"enemy/jerky.png");a.routine=[(new Movement(Movement.COND.X)).add(Gizmo.TYPE.AIM,Gizmo.DEST.TO_X).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X),(new Movement(Movement.COND.Y)).add(Gizmo.TYPE.AIM,Gizmo.DEST.TO_Y).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_Y)];return a};$jscomp.inherits(Jerky,Enemy);
var Juno=function(a,b){a=Enemy.call(this,a,b)||this;a.hasBounds=!1;a.dir=Math.PI;a.speed=1;a.hitPoint=16;a.score=7500;a.anim=new Animator(a,"enemy/juno.png");a.routine=[(new Movement(200)).add(Gizmo.TYPE.FIXED,Gizmo.DEST.TO),(new Movement(Number.MAX_VALUE)).add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE)];return a};$jscomp.inherits(Juno,Enemy);
var Slur=function(a,b){a=Enemy.call(this,a,b)||this;a.hasBounds=!1;a.dir=0>=a.x?0:Math.PI;a.step=Math.PI/8;a.speed=2;a.hitPoint=3;a.score=300;a.anim=new Animator(a,"enemy/slur.png");a.routine=[(new Movement(Slur.RANGE)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L).add(Gizmo.TYPE.FIXED,Gizmo.DEST.ROTATE),(new Movement(4*Slur.RANGE)).add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE),(new Movement(Slur.RANGE)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R).add(Gizmo.TYPE.FIXED,Gizmo.DEST.ROTATE),(new Movement(4*Slur.RANGE)).add(Gizmo.TYPE.CHASE,
Gizmo.DEST.ROTATE)];return a};$jscomp.inherits(Slur,Enemy);Slur.RANGE=4;var Tentacle=function(a,b){a=Chain.call(this,a,b)||this;a.hasBounds=!1;a.speed=.1;a.hitPoint=16;a.appears=!1;a.anim=new Animator(a,"enemy/tentacle.png");a.routine=[(new Movement).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO).add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE,Tentacle.DEG_STEP)];a.push(new TentacleHead(0));for(b=0;b<Tentacle.MAX_JOINT;b++){var c=Tentacle.MAX_JOINT-b;a.push(new TentacleJoint(c*c))}a.score=150;return a};
$jscomp.inherits(Tentacle,Chain);Tentacle.prototype.eject=function(){for(var a=this.next;a;)a.eject(),a=a.next;this.isGone=!0;this.x=-this.width};Tentacle.prototype.calcRadian=function(){return this.radian};Tentacle.prototype.calcRelative=function(){return this.radian};
Tentacle.prototype.move=function(a){this.radius=this.hitPoint/2+8;this.scale=this.radius/Tentacle.MAX_RADIUS;this.region=new Region(this,this.radius);Chain.prototype.move.call(this,a);if(!this.appears){this.appears=!0;a=[];for(var b=this.next;b;)a.push(b),b=b.next;return a}};Tentacle.MAX_JOINT=8;Tentacle.MAX_RADIUS=16;Tentacle.DEG_STEP=Math.PI/900;
var TentacleJoint=function(a){var b;b=Chain.call(this,0,0)||this;b.hasBounds=!1;b.radius=4;b.radian=0;b.speed=a;b.anim=new Animator(b,"enemy/tentacleJoint.png");return b};$jscomp.inherits(TentacleJoint,Chain);TentacleJoint.prototype.calcRadian=function(){return Math.trim(this.prev.calcRadian()+this.radian)};TentacleJoint.prototype.calcRelative=function(){return Math.trim(this.radian-this.prev.calcRadian())};
TentacleJoint.prototype.rotate=function(a){var b=this.calcRadian();this.radian=Math.close(b,Math.atan2(a.y-this.y,a.x-this.x),TentacleJoint.DEG_STEP*this.speed);this.radian=this.calcRelative();this.radian<-TentacleJoint.MAX_RAD&&(this.radian=-TentacleJoint.MAX_RAD);TentacleJoint.MAX_RAD<this.radian&&(this.radian=TentacleJoint.MAX_RAD)};TentacleJoint.prototype.move=function(a){var b=this.prev,c=b.calcRadian(),d=b.radius+this.radius;this.x=b.x+Math.cos(c)*d;this.y=b.y+Math.sin(c)*d;return this.rotate(a)};
TentacleJoint.prototype.fate=function(){};TentacleJoint.DEG_STEP=Math.PI/18E3;TentacleJoint.MAX_RAD=Math.PI/6;var TentacleBullet=function(a,b){a=Bullet.call(this,a,b)||this;a.region=new Region(a,1);a.speed=.5;a.width=2;a.fillStyle="rgba(255, 200, 200, 0.7)";return a};$jscomp.inherits(TentacleBullet,Bullet);var TentacleHead=function(a){a=TentacleJoint.call(this,a)||this;a.anim=new Animator(a,"enemy/tentacleHead.png");a.chamberList=[new Chamber(TentacleBullet,TentacleHead.TRIGGER_CYCLE)];return a};
$jscomp.inherits(TentacleHead,TentacleJoint);TentacleHead.MAX_RAD=TentacleJoint.MAX_RAD;TentacleHead.prototype.rotate=function(a){this.radian=Math.close(this.radian,Math.atan2(a.y-this.y,a.x-this.x),TentacleHead.DEG_STEP);return this.trigger(a)};TentacleHead.TRIGGER_CYCLE=10;TentacleHead.DEG_STEP=Math.PI/100;ImageManager.Instance.reserve(["enemy/tentacle.png","enemy/tentacleHead.png"]);
var Twister=function(a,b){a=Enemy.call(this,a,b)||this;a.hasBounds=!1;a.dir=0>=a.x?0:Math.PI;a.step=Math.PI/23;a.speed=3;a.score=100;a.anim=new Animator(a,"enemy/twister.png");a.routine=[(new Movement(Twister.RANGE)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L).add(Gizmo.TYPE.FIXED,Gizmo.DEST.ROTATE),(new Movement(Twister.RANGE)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R).add(Gizmo.TYPE.FIXED,Gizmo.DEST.ROTATE),(new Movement(Twister.RANGE)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R).add(Gizmo.TYPE.FIXED,Gizmo.DEST.ROTATE),
(new Movement(Twister.RANGE)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L).add(Gizmo.TYPE.FIXED,Gizmo.DEST.ROTATE)];return a};$jscomp.inherits(Twister,Enemy);Twister.RANGE=13;
var Waver=function(a,b){a=Enemy.call(this,a,b)||this;a.dir=0>=a.x?0:Math.PI;a.step=Math.PI/60;a.speed=2.5;a.score=100;a.anim=new Animator(a,"enemy/waver.png",Animator.TYPE.Y,1,8);a.routine=[(new Movement(Waver.RANGE)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L),(new Movement(Waver.RANGE)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R),(new Movement(Waver.RANGE)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R),(new Movement(Waver.RANGE)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L)];return a};$jscomp.inherits(Waver,Enemy);
Waver.RANGE=18;var MissileCapsule=function(a){a=Capsule.call(this,a)||this;a.anim=new Animator(a,"capsule/missileCapsule.png",Animator.TYPE.Y);return a};$jscomp.inherits(MissileCapsule,Capsule);MissileCapsule.prototype.fate=function(a){a.powerUpMissile();this.eject()};var SpeedupCapsule=function(a){a=Capsule.call(this,a)||this;a.anim=new Animator(a,"capsule/speedupCapsule.png",Animator.TYPE.Y);return a};$jscomp.inherits(SpeedupCapsule,Capsule);
SpeedupCapsule.prototype.fate=function(a){a.speedup();this.eject()};var Molten=function(a,b){a=Enemy.call(this,a,b)||this;a.region=new Region(a,14);a.hasBounds=!1;a.dir=0;a.speed=.4;a.effectH=!1;a.hitPoint=Number.MAX_SAFE_INTEGER;a.cycle=0;a.phase=Molten.PHASE.TARGET;a.rock=[];a.appears=!1;a.anim=new Animator(a,"boss/molten.png");a.routine=[(new Movement).add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE)];return a};$jscomp.inherits(Molten,Enemy);
Molten.prototype.move=function(a){Enemy.prototype.move.call(this,a);Molten.MAX_CYCLE<this.cycle++&&(this.cycle=0,this.phase++,this.phase%=Molten.PHASE.length);if(this.appears)return this.checkDestroy(a),[];this.appears=!0;a=new MoltenRock(this,this.x,this.y);this.rock=[a];return[a]};Molten.prototype.checkDestroy=function(a){var b=[];this.rock.forEach(function(a){a.isGone||b.push(a)});0==b.length&&(this.hitPoint=0,this.fate(a));this.rock=b};Molten.MAX_CYCLE=700;Molten.PHASE={OWN:0,TARGET:1,length:2};
var MoltenRock=function(a,b,c){b=Enemy.call(this,b,c)||this;b.hasBounds=!1;b.parent=a;b.dir=0;b.speed=.6;b.hitPoint=5;b.score=10;b.anim=new Animator(b,"boss/moltenRock.png");b.routine=[(new Movement).add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE)];return b};$jscomp.inherits(MoltenRock,Enemy);
MoltenRock.prototype.move=function(a){var b=[],c=this.parent;c.phase==Molten.PHASE.OWN?b=Enemy.prototype.move.call(this,c):Enemy.prototype.move.call(this,a);if(this.absorbed&&this.hitPoint){a=Math.trim(this.dir+Math.SQ);for(var d=0;3>d;d++){var e=new MoltenRock(c,this.x,this.y);e.dir=a;e.speed=1.2*this.speed;e.hitPoint=this.hitPoint;b.push(e);c.rock.push(e);a=Math.trim(a+Math.SQ)}}this.absorbed=!1;return b};function MotionManager(){Repository.apply(this,arguments)}MotionManager.prototype=Object.create(Repository.prototype);
MotionManager.INSTANCE=new MotionManager;MotionManager.prototype.makeName=function(a){return"motion/"+a+".json"};function Motion(a,b,c,d){this.type=a;this.key=b;this.speed=c;this.h=d;this.y=this.x=this.v=0;this.triggerMax=this.triggerMin=Number.NaN;this.filling=this.reserve=null;this.batter=0}Motion.TYPE={NORMAL:0,ONLY_ONE:1,REWIND:2};Motion.prototype.rotateV=function(a){this.v=a;return this};Motion.prototype.offsetX=function(a){this.x=a;return this};
Motion.prototype.offsetY=function(a){this.y=a;return this};Motion.prototype.shot=function(a,b,c){this.reserve={type:a,id:b};isFinite(c)?(this.triggerMin=c,this.triggerMax=c+this.speed):(this.triggerMin=c.min,this.triggerMax=c.max);return this};Motion.prototype.reset=function(){if(this.mot=MotionManager.INSTANCE.dic[this.key])this.max=this.mot.length-1;this.ix=0;this.dir=1;return this};
Motion.prototype.next=function(){var a=this.ix+this.speed*this.dir;if(this.max<=a){if(this.type!=Motion.TYPE.REWIND)return null;this.ix=this.max;this.dir*=-1;return[this.mot[this.ix]]}if(0>a)return null;for(var b=[];this.ix!=a;)this.ix+=this.dir,b.push(this.mot[this.ix]);this.checkTrigger();return b};Motion.prototype.checkTrigger=function(){this.filling||(0<this.batter?this.batter=0:this.triggerMin<=this.ix&&this.ix<=this.triggerMax&&(this.filling=this.reserve,this.batter=1))};
Motion.prototype.fire=function(){if(this.filling){var a=this.filling;this.filling=null;return a}};function MotionRoutine(a){this.routine=a;this.ix=0;this.max=this.routine.length-1;this.loop=0;this.current=this.routine[this.ix].reset()}
MotionRoutine.prototype.next=function(a){var b=this.current.ix,c=this.current.next();null==c&&(this.ix++,this.max<this.ix&&(this.ix=0,this.loop++),this.current=this.routine[this.ix].reset(),0<this.loop&&this.current.type==Motion.TYPE.ONLY_ONE&&(this.ix++,this.current=this.routine[this.ix].reset()),c=this.current.next());var d=this.current.ix<b?-1:1,b=this.current.fire();a.rotationH=this.current.h;a.rotationV=this.current.v;a.offsetX=this.current.x;a.offsetY=this.current.y;a.calcRotationMatrix();c.forEach(function(b){a.shift(b,
d);a.calculate()});return b};function Skeleton(a){this.data=a;this.map={};this.offsetY=this.offsetX=0;this.rotationH=Math.PI/4;this.rotationV=Math.PI/8;this.rotationMatrix=new Matrix(Matrix.NO_EFFECT);this.init()}Skeleton.prototype.init=function(){var a=Object.assign(new Bone,this.data.root);this.data.root=a;this.prepare(a);this.calcRotationMatrix()};
Skeleton.prototype.prepare=function(a){var b=this,c=[];a.prepare();a.joint.forEach(function(b){b.parent=a;c.push(Object.assign(new Bone,b))});a.joint=c;a.joint.forEach(function(a){b.prepare(a)});a.skeleton=this;this.map[a.name]=a};Skeleton.prototype.calcRotationMatrix=function(){var a=Matrix.rotateY(this.rotationH);this.rotationMatrix=Matrix.rotateX(this.rotationV).multiply(a)};Skeleton.prototype.rotateH=function(a){this.rotationH+=Math.PI/720*a;this.rotationH=Math.trim(this.rotationH);this.calcRotationMatrix()};
Skeleton.prototype.rotateV=function(a){this.rotationV+=Math.PI/720*a;this.rotationV=Math.trim(this.rotationV);this.calcRotationMatrix()};Skeleton.prototype.shift=function(a,b){var c=this;a.forEach(function(a){var d=a.r,f=c.map[a.name],g=Matrix.rotateX(d.x),h=Matrix.rotateY(d.y),d=Matrix.rotateZ(d.z);f.motionMatrix=d.multiply(h).multiply(g);a.p&&(a=a.p,g=f.pt,f.translateMatrix=new Matrix([[1,0,0,c.offsetX+g.x+a.x*b],[0,1,0,c.offsetY+g.y+a.y*b],[0,0,1,g.z+a.z*b],[0,0,0,1]]))})};
Skeleton.prototype.calculate=function(a){this.data.root.calculate(a)};Skeleton.prototype.draw=function(a){this.data.root.draw(a)};function Bone(){this.pt={x:0,y:0,z:0}}
Bone.prototype.prepare=function(){var a=this.translate,b=Matrix.rotateX(this.axis.x),c=Matrix.rotateY(this.axis.y),b=Matrix.rotateZ(this.axis.z).multiply(c).multiply(b);this.translateMatrix=new Matrix([[1,0,0,a.x],[0,1,0,a.y],[0,0,1,a.z],[0,0,0,1]]);if(this.parent){var d=this.parent,a=Matrix.rotateX(-d.axis.x),c=Matrix.rotateY(-d.axis.y),d=Matrix.rotateZ(-d.axis.z);this.axisMatrix=a.multiply(c).multiply(d).multiply(b)}else this.axisMatrix=b;this.motionMatrix=new Matrix(Matrix.NO_EFFECT)};
Bone.prototype.getAccum=function(){if(this.parent){var a=this.axisMatrix.multiply(this.motionMatrix).multiply(this.translateMatrix);return this.parent.getAccum().multiply(a)}return this.translateMatrix.multiply(this.motionMatrix)};Bone.prototype.calculate=function(a){this.pt=this.getAccum().affine(0,0,0);a||this.joint.forEach(function(a){a.calculate(!1)})};
Bone.prototype.drawLine=function(a){var b=this.parent.pt,c=this.pt,d=this.skeleton.rotationMatrix,b=d.affine(b.x,b.y,b.z),c=d.affine(c.x,c.y,c.z),d=c.x,e=-c.y,f=b.x,b=-b.y,g=d-f,h=e-b;this.cx=f+g/2;this.cy=b+h/2;this.cz=c.z;this.radian=Math.atan2(h,g);a.beginPath();a.moveTo(f,b);a.lineTo(d,e);a.stroke()};Bone.prototype.draw=function(a){this.calculate();this.parent&&this.drawLine(a);this.joint.forEach(function(b){b.draw(a)})};
var Titan=function(a,b){a=Enemy.call(this,a,b)||this;a.scale=7;a.hitPoint=Number.MAX_SAFE_INTEGER;a.motionRoutine=new MotionRoutine([(new Motion(Motion.TYPE.ONLY_ONE,"111_7.amc",2,Math.PI/4)).offsetX(0).offsetY(0),(new Motion(Motion.TYPE.NORMAL,"79_96.amc",1,.4*-Math.PI)).shot(TitanShot,["lradius","lwrist","lhand","lthumb","lfingers"],200),(new Motion(Motion.TYPE.REWIND,"133_01.amc",2,Math.PI)).shot(TitanBullet,["thorax","upperneck"],{min:200,max:550}),(new Motion(Motion.TYPE.NORMAL,"79_91.amc",1,
.4*-Math.PI)).shot(TitanBall,["rhumerus","rradius","rwrist","rhand"],{min:175,max:200}),(new Motion(Motion.TYPE.NORMAL,"86_01b.amc",2,Math.PI)).shot(Bullet,["lfingers","rfingers"],{min:0,max:1E3})]);if(b=Object.assign({},MotionManager.INSTANCE.dic.asf))a.skeleton=new Skeleton(b),a.setupBone();return a};$jscomp.inherits(Titan,Enemy);
Titan.prototype.setupBone=function(){var a={};Object.keys(this.skeleton.map).forEach(function(b){if("root"!=b){var c=new TitanBone(b,0,0);b==Titan.CORE&&(c.hitPoint=Titan.HIT_POINT);a[b]=c}});this.boneMap=a;this.appears=!1};Titan.prototype.eject=function(){var a=this;Enemy.prototype.eject.call(this);Object.keys(this.boneMap).forEach(function(b){b=a.boneMap[b];b.hitPoint=0;b.explosion=2*Actor.MAX_EXPLOSION})};
Titan.prototype.move=function(a){var b=this,c=[],d=this.motionRoutine.next(this.skeleton);Enemy.prototype.move.call(this,a);if(!this.appears)return Object.keys(this.boneMap).forEach(function(a){c.push(b.boneMap[a])}),this.appears=!0,c.reverse();var e=this.skeleton.map,f=!1;d&&d.id.forEach(function(a){a=b.boneMap[a];var e=new d.type(a.x,a.y);e.dir=a.radian;c.push(e)});Object.keys(this.boneMap).forEach(function(a){var c=e[a],d=c.cy*b.scale+b.y;a=b.boneMap[a];a.x=c.cx*b.scale+b.x;a.y=d;a.z=c.cz;a.radian=
c.radian;0==a.hitPoint&&(f=!0)});f&&this.eject();return c};Titan.prototype.drawInfo=function(a){var b=this.motionRoutine.current,c=this.boneMap[Titan.CORE];a.save();a.translate(this.x,this.y);a.strokeStyle="rgba(255, 255, 255, 0.8)";a.strokeText("ix:"+b.ix,0,0);a.strokeText("hp:"+c.hitPoint,0,10);a.restore()};Titan.prototype.drawNormal=function(a){a.save();a.translate(this.x,this.y);this.skeleton&&(a.scale(this.scale,this.scale),a.strokeStyle="rgba(203, 152, 135, 0.2)",this.skeleton.draw(a));a.restore()};
Titan.prototype.isHit=function(a){return!1};Titan.HIT_POINT=292;Titan.CORE="lowerback";var TitanBone=function(a,b,c){var d="boss/titan/"+a+".png";b=Enemy.call(this,b,c)||this;b.id=a;b.hasBounds=!1;b.hitPoint=Number.MAX_SAFE_INTEGER;b.filling=null;b.anim=new Animator(b,d);return b};$jscomp.inherits(TitanBone,Enemy);TitanBone.prototype.drawNormal=function(a){Enemy.prototype.drawNormal.call(this,a)};
$jscomp.global.Object.defineProperties(TitanBone.prototype,{triggered:{configurable:!0,enumerable:!0,get:function(){return!1}}});ImageManager.Instance.reserve("boss/titan/head.png boss/titan/lclavicle.png boss/titan/lfemur.png boss/titan/lfingers.png boss/titan/lfoot.png boss/titan/lhand.png boss/titan/lhipjoint.png boss/titan/lhumerus.png boss/titan/lowerback.png boss/titan/lowerneck.png boss/titan/lradius.png boss/titan/lthumb.png boss/titan/ltibia.png boss/titan/ltoes.png boss/titan/lwrist.png boss/titan/rclavicle.png boss/titan/rfemur.png boss/titan/rfingers.png boss/titan/rfoot.png boss/titan/rhand.png boss/titan/rhipjoint.png boss/titan/rhumerus.png boss/titan/rradius.png boss/titan/rthumb.png boss/titan/rtibia.png boss/titan/rtoes.png boss/titan/rwrist.png boss/titan/thorax.png boss/titan/upperback.png boss/titan/upperneck.png".split(" "));
var TitanBall=function(a,b){a=Enemy.call(this,a,b)||this;a.hasBounds=!1;a.speed=1.5+4*Math.random();a.gravity=.03;a.hitPoint=4;a.anim=new Animator(a,"boss/titan/titan.ball.png");return a};$jscomp.inherits(TitanBall,Enemy);TitanBall.prototype.reactY=function(a){Enemy.prototype.reactY.call(this,a);this.fate(this)};$jscomp.global.Object.defineProperties(TitanBall.prototype,{triggered:{configurable:!0,enumerable:!0,get:function(){return!1}}});
var TitanBullet=function(a,b){a=Enemy.call(this,a,b)||this;a.dir=-Math.PI+Math.SQ/2;a.radian=a.dir;a.speed=4;a.hitPoint=Number.MAX_SAFE_INTEGER;a.anim=new Animator(a,"boss/titan/titan.bullet.png");return a};$jscomp.inherits(TitanBullet,Enemy);$jscomp.global.Object.defineProperties(TitanBullet.prototype,{triggered:{configurable:!0,enumerable:!0,get:function(){return!1}}});
var TitanShot=function(a,b){a=Enemy.call(this,a,b)||this;a.dir=Math.PI;a.radian=a.dir;a.speed=7;a.hitPoint=Number.MAX_SAFE_INTEGER;a.anim=new Animator(a,"boss/titan/titan.shot.png");return a};$jscomp.inherits(TitanShot,Enemy);
var Winding=function(a,b){a=Chain.call(this,a,b)||this;a.region=new Region(a,12);a.dir=-Math.PI;a.step=Math.SQ/100;a.radius=Winding.RADIUS;a.speed=.5;a.hitPoint=100;a.hasBounds=!1;a.ratio=Winding.RATIO_MAX;a.delta=-1;a.uncoil=!1;a.anim=new Animator(a,"boss/winding.png");a.routine=[(new Movement(200)).add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE,Math.PI/180),(new Movement(20)).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R)];a.chamberList=[new Chamber(Slur,Winding.TRIGGER_CYCLE)];a.init();return a};
$jscomp.inherits(Winding,Chain);Winding.prototype.init=function(){this.appears=!1;for(var a=0;a<Winding.MAX_JOINT;a++)this.push(new WindingChild(this.x,this.y))};
Winding.prototype.move=function(a){var b=Chain.prototype.move.call(this,a),c=Math.trim(this.dir-Math.SQ/2);this.rad=Math.trim(this.dir+Math.SQ);if(this.appears){for(var d=this.next;d;)c+=Winding.RADIAN_STEP*this.ratio/100,d.radian=Math.trim(c),d=d.next;this.uncoil&&(this.ratio+=this.delta,1>=this.ratio?this.delta*=-1:Winding.RATIO_MAX<=this.ratio&&(this.uncoil=!1,this.delta*=-1,b=this.trigger(a,!0),b.forEach(function(b){b.aim(a);b.dir=Math.trim(b.dir+Math.PI)})));return b}this.appears=!0;for(c=this.next;c;)b.push(c),
c=c.next;return b};Winding.prototype.fate=function(a){Chain.prototype.fate.call(this,a);this.uncoil=!0};Winding.RADIUS=16;Winding.RADIAN_STEP=Math.SQ;Winding.RATIO_MAX=50;Winding.MAX_JOINT=20;Winding.TRIGGER_CYCLE=20;var WindingChild=function(a,b){a=Chain.call(this,a,b)||this;a.hasBounds=!1;a.effectH=!1;a.radius=WindingChild.RADIUS;a.anim=new Animator(a,"boss/winding.joint.png");return a};$jscomp.inherits(WindingChild,Chain);
WindingChild.prototype.move=function(a){a=this.prev;var b=this.radius+a.radius;this.x=a.x+Math.cos(this.radian)*b;this.y=a.y+Math.sin(this.radian)*b};WindingChild.prototype.fate=function(){};WindingChild.RADIUS=4;var Cascade=function(a,b){var c;c=Chain.call(this,a,b)||this;c.anim=new Animator(c,"material/cascade.png");c.radian=Math.SQ;c.radius=Cascade.RADIUS;c.appears=!1;for(var d=0;d<Cascade.MAX_JOINT;d++)c.push(new CascadeChild(a,b,3*(Cascade.MAX_JOINT-d)));return c};$jscomp.inherits(Cascade,Chain);
Cascade.prototype.move=function(a){Chain.prototype.move.call(this,a);if(!this.appears){this.appears=!0;a=[];for(var b=this.next;b;)a.push(b),b=b.next;return a}};Cascade.prototype.fate=function(){};Cascade.RADIUS=4;Cascade.MAX_JOINT=12;var CascadeChild=function(a,b,c){a=Chain.call(this,a,b)||this;a.effectH=!1;a.effectV=!1;a.weight=c;a.radian=.9*Math.SQ;a.radius=Cascade.RADIUS;a.step=0;Field.Instance&&(a.maxX=Field.Instance.width+100);return a};$jscomp.inherits(CascadeChild,Chain);
CascadeChild.prototype.addRadian=function(a){return this.radian=Math.trim(this.radian+a)};CascadeChild.prototype.move=function(a){a=this.prev;var b=Math.trim(Math.SQ-this.radian)/(300+10*this.weight);this.step+=b;0==parseInt(1E3*b)&&(this.step*=.98);var b=Math.trim(this.radian+this.step),c=this.radius+a.radius;0>b&&(b=0);this.radian=b;this.x=a.x+Math.cos(b)*c;this.y=a.y+Math.sin(b)*c};
CascadeChild.prototype.draw=function(a){a.save();a.fillStyle="rgba(60, 200, 0, 0.8)";a.translate(this.x,this.y);a.beginPath();a.arc(0,0,this.radius,0,Math.PI2,!1);a.fill();a.restore()};CascadeChild.prototype.fate=function(a){a=Math.PI/200;this.step-=a;for(var b=this.next;b;)b.step-=.8*a,b=b.next};
var Rewinder=function(a,b){var c;c=Chain.call(this,a,b)||this;c.step=Math.SQ/100;c.radius=Rewinder.RADIUS;c.speed=1.1;c.hitPoint=Number.MAX_SAFE_INTEGER;c.hasBounds=!1;c.ratio=Rewinder.RATIO_MAX;c.delta=-.8;c.anim=new Animator(c,"material/cascade.png");c.routine=[(new Movement).add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED,Gizmo.DEST.TO)];c.appears=!1;for(var d=0;d<Rewinder.MAX_JOINT;d++)c.push(new RewinderChild(a,b));return c};$jscomp.inherits(Rewinder,Chain);
Rewinder.prototype.move=function(a){var b=[],c=Math.trim(this.radian+Math.SQ/2);Chain.prototype.move.call(this,a);if(this.appears){for(a=this.next;a;)c-=Rewinder.RADIAN_STEP*this.ratio/100,a.radian=Math.trim(c),a=a.next;this.ratio+=this.delta;1>=this.ratio?this.delta*=-1:Rewinder.RATIO_MAX<=this.ratio&&(this.delta*=-1);return b}this.appears=!0;for(a=this.next;a;)b.push(a),a=a.next;return b};Rewinder.prototype.fate=function(){};Rewinder.RADIUS=4;Rewinder.RADIAN_STEP=Math.SQ;Rewinder.RATIO_MAX=100;
Rewinder.MAX_JOINT=16;var RewinderChild=function(a,b){a=Chain.call(this,a,b)||this;a.radian=0;a.hasBounds=!1;a.effectH=!1;a.effectV=!1;a.radius=RewinderChild.RADIUS;a.anim=new Animator(a,"boss/winding.joint.png");return a};$jscomp.inherits(RewinderChild,Chain);RewinderChild.prototype.move=function(a){a=this.prev;var b=this.radius+a.radius;this.x=a.x+Math.cos(this.radian)*b;this.y=a.y+Math.sin(this.radian)*b};RewinderChild.prototype.fate=function(){};RewinderChild.RADIUS=4;
Enemy.LIST=[{name:"Waver",type:Waver,img:"enemy/waver.png",h:16},{name:"Battery",type:Battery,img:"enemy/battery.png"},{name:"Bouncer",type:Bouncer,img:"enemy/bouncer.png"},{name:"Hanker",type:Hanker,img:"enemy/hanker.png"},{name:"Jerky",type:Jerky,img:"enemy/jerky.png"},{name:"Juno",type:Juno,img:"enemy/juno.png"},{name:"Crab",type:Crab,img:"enemy/crab.png"},{name:"Hatch",type:Hatch,img:"enemy/hatch.png",h:16},{name:"Charger",type:Charger,img:"enemy/charger.png",h:16},{name:"Twister",type:Twister,
img:"enemy/twister.png",h:16},{name:"Slur",type:Slur,img:"enemy/slur.png",h:16},{name:"Waver",type:Waver,img:"enemy/waver.png",h:16},{name:"Waver",type:Waver,img:"enemy/waver.png",h:16},{name:"Waver",type:Waver,img:"enemy/waver.png",h:16},{name:"Waver",type:Waver,img:"enemy/waver.png",h:16},{name:"Waver",type:Waver,img:"enemy/waver.png",h:16},{name:"Waver",type:Waver,img:"enemy/waver.png",h:16},{name:"Waver",type:Waver,img:"enemy/waver.png",h:16},{name:"Waver",type:Waver,img:"enemy/waver.png",h:16},
{name:"Waver",type:Waver,img:"enemy/waver.png",h:16},{name:"Tentacle",type:Tentacle,img:"enemy/tentacle.png"},{name:"Dragon",type:DragonHead,img:"enemy/dragonHead.png"},{name:"Waver(formation)",type:Waver,img:"enemy/waver.png",h:16,formation:!0},{name:"Molten",type:Molten,img:"boss/molten.png"},{name:"Winding",type:Winding,img:"boss/winding.png"},{name:"Titan",type:Titan,img:"boss/titan.icon.png"},{name:"Cascade",type:Cascade,img:"material/cascade.icon.png"},{name:"Rewinder",type:Rewinder,img:"material/cascade.icon.png"}];
Stage.LIST=[(new Stage(Stage.SCROLL.OFF,"stage00map.png",[new StageBg("stage01bg0.png",.3),new StageBg("stage01bg1.png",.4,0,.02),new StageFg("stage00bg.png")])).setBgm("bgm-edo-beth"),(new Stage(Stage.SCROLL.OFF,"stage01map.png",[new StageBg("stage01bg1.png",.3,0,.02),new StageBg("stage01bg0.png",.3),new StageFg("stage01bg.png",.6)])).setBgm("bgm-MadNightDance","bgm-edo-omega-zero"),(new Stage(Stage.SCROLL.LOOP,"stage00map.png",[new StageBg("stage01bg0.png",.3),new StageBg("stage01bg1.png",.4,0,
.02),new StageFg("stage00bg.png")])).setBgm("bgm-edo-beth"),(new Stage(Stage.SCROLL.ON,"stage02map.png",[new StageBg("stage01bg1.png",.3),new StageBg("stage01bg0.png",.4),new StageFg("stage02bg.png")])).setBgm("bgm-pierrot-cards","bgm-edo-omega-zero"),(new Stage(Stage.SCROLL.OFF,"stage1.map.png",[new StageBg("stage01bg1.png",.3),new StageBg("stage01bg0.png",.4),new StageFg("stage1.1.0.png",.6)])).setBgm("bgm-ThroughTheDark","bgm-edo-omega-zero"),(new Stage(Stage.SCROLL.ON,"stage2.map.png",[new StageBg("stage2.1.1.png",
.3),new StageBg("stage01bg1.png",1,-Math.SQ/2),new StageFg("stage2.1.0.png")])).setBgm("bgm-pierrot-cards","bgm-edo-omega-zero"),(new Stage(Stage.SCROLL.OFF,"stage3.map.png",[new StageBg("stage01bg1.png",.3),new StageFg("stage3.1.1.png",.5,0,.02),new StageFg("stage3.1.0.png")])).setBgm("bgm-YourDream-R","bgm-edo-omega-zero"),(new Stage(Stage.SCROLL.LOOP,"stage4.map.png",[new StageBg("stage01bg1.png",.3),new StageFg("stage01bg0.png",.5,0,.02),new StageFg("stage4.1.0.png",.3)])).setBgm("bgm-MadNightDance",
"bgm-edo-omega-zero")];AudioMixer.INSTANCE.reserve(["sfx-fire","sfx-explosion","sfx-absorb"]);MotionManager.INSTANCE.reserve("asf 79_91.amc 79_96.amc 86_01b.amc 111_7.amc 133_01.amc".split(" "));
