function EnmBattery(){Enemy.apply(this,arguments);this.speed=0;this.hitPoint=1;this.score=10;this.anim=new Animator(this,"enmBattery.png",Animator.TYPE.NONE);this.base=new Image();this.base.src="img/enmBatteryBase.png";this.routine=[new Movement().add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED,Gizmo.DEST.TO)];this.isInverse=false;if(this.field&&this.field.landform){var a=this.field.landform;var b={x:this.x,y:this.y+Landform.BRICK_WIDTH};a.hitTest(b);this.isInverse=!b.isHitWall}}EnmBattery.prototype=Object.create(Enemy.prototype);EnmBattery.prototype._drawNormal=Enemy.prototype.drawNormal;EnmBattery.prototype.drawNormal=function(a){this._drawNormal(a);a.save();a.translate(this.x,this.y);if(this.isInverse){a.rotate(Math.PI)}a.drawImage(this.base,-this.hW,-this.hH);a.restore()};function EnmBouncer(){Enemy.apply(this,arguments);this.dir=this.x<=0?0:Math.PI;this.speed=2.5;this.gravity=0.1;this.reaction=0.95;this.hitPoint=3;this.score=50;this.shuttle=2;this.img.src="img/enmBouncer.png"}EnmBouncer.prototype=Object.create(Enemy.prototype);EnmBouncer.prototype._move=Enemy.prototype.move;EnmBouncer.prototype.move=function(a){if(this.shuttle&&(this.x<0||this.field.width+Landform.BRICK_WIDTH<this.x)){this.dir=Math.trim(this.dir+Math.PI);this.x=this.svX;this.dx=-this.dx;this.shuttle--}if(this.isHitWall){this.x=this.svX;this.y=this.svY}return this._move(a)};EnmBouncer.prototype.drawNormal=function(b){var c=Math.abs(this.dy);var d=c<5?0.75+c/20:1;var a=this.y/d;b.save();b.translate(this.x,this.y);b.scale(1,d);b.drawImage(this.img,-this.hW,-this.hH);b.restore()};function EnmCrab(){Enemy.apply(this,arguments);this.gravity=0.3;this.reaction=0.4;this.speed=1.5;this.hitPoint=1;this.score=90;this.anim=new Animator(this,"enmCrab.png",Animator.TYPE.X,8,1);this.routine=[new Movement().add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X)]}EnmCrab.prototype=Object.create(Enemy.prototype);function EnmDragonBody(){Enemy.apply(this,arguments);this.effectH=false;this.effectV=false;this.hitPoint=Number.MAX_SAFE_INTEGER;this.score=0;this.anim=new Animator(this,"enmDragonBody.png",Animator.TYPE.NONE)}EnmDragonBody.prototype=Object.create(Enemy.prototype);EnmDragonBody.prototype._recalculation=Actor.prototype.recalculation;EnmDragonBody.prototype.recalculation=function(){this._recalculation();this.minX=-this.field.width;this.minY=-this.field.height;this.maxX=this.field.width*2;this.maxY=this.field.height*2};EnmDragonBody.prototype.trigger=NOP;function EnmDragonHead(){Enemy.apply(this,arguments);if(0<this.x){this.x+=50}else{this.x-=50}this.speed=1.8;this.effectH=false;this.hitPoint=200;this.score=1000;this.radian=Math.PI;this.appears=false;this.anim=new Animator(this,"enmDragonHead.png",Animator.TYPE.NONE);this.locus=[];this.body=[];for(var b=0;b<EnmDragonHead.CNT_OF_BODY*EnmDragonHead.STP_OF_BODY;b++){this.locus.push({x:this.x,y:this.y,radian:this.radian});if(b%EnmDragonHead.STP_OF_BODY==0){var a=new EnmDragonBody(this.field,this.x,this.y);this.body.push(a)}}}EnmDragonHead.prototype=Object.create(Enemy.prototype);EnmDragonHead.CNT_OF_BODY=10;EnmDragonHead.STP_OF_BODY=16;EnmDragonHead.prototype._recalculation=Actor.prototype.recalculation;EnmDragonHead.prototype.recalculation=function(){this._recalculation();this.minX=-this.field.width;this.minY=-this.field.height;this.maxX=this.field.width*2;this.maxY=this.field.height*2};EnmDragonHead.prototype._eject=Actor.prototype.eject;EnmDragonHead.prototype.eject=function(){this._eject();this.body.forEach(function(a){a.hitPoint=0;a.explosion=Actor.MAX_EXPLOSION})};EnmDragonHead.prototype._move=Enemy.prototype.move;EnmDragonHead.prototype.move=function(f){var b=Math.trim(this.radian+this.closeGap(f)*1.8);this.dir=b;this.radian=b;this._move(f);for(var e=0;e<EnmDragonHead.CNT_OF_BODY;e++){var a=this.body[e];var c=(e+1)*EnmDragonHead.STP_OF_BODY-1;var d=this.locus[c];a.x=d.x;a.y=d.y;a.radian=d.radian}this.locus.unshift({x:this.x,y:this.y,radian:this.radian});this.locus.pop();if(this.appears){return}this.appears=true;return this.body};function EnmFormation(){Actor.apply(this,arguments);this.effectH=false;this.bonus=800;this.score=this.bonus;this.steps=0;this.count=0;this.enemies=[]}EnmFormation.prototype=Object.create(Actor.prototype);EnmFormation.STEP=5;EnmFormation.prototype.setup=function(c,b){for(var a=0;a<b;a++){this.enemies.push(new c(this.field,this.x,this.y))}return this};EnmFormation.prototype.checkDestroy=function(){var b=this;var a=[];this.enemies.forEach(function(c){if(c.hitPoint==0){return}a.push(c);b.x=c.x;b.y=c.y});this.enemies=a;if(a.length==0&&this.explosion==0){this.explosion=Actor.MAX_EXPLOSION*4;return}};EnmFormation.prototype._move=Actor.prototype.move;EnmFormation.prototype.move=function(a){this._move(a);if(this.enemies.length<=this.count){this.checkDestroy();return}if(this.steps++%EnmFormation.STEP!=0){return}return[this.enemies[this.count++]]};EnmFormation.prototype.drawExplosion=function(a){a.fillStyle="rgba(240, 240, 255, .8)";a.fillText(this.bonus,this.x,this.y)};function EnmHanker(){Enemy.apply(this,arguments);this.speed=1.5;this.hitPoint=2;this.score=50;this.anim=new Animator(this,"enmHanker.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO)]}EnmHanker.prototype=Object.create(Enemy.prototype);function EnmJerky(){Enemy.apply(this,arguments);this.speed=2;this.hitPoint=1;this.score=10;this.anim=new Animator(this,"enmJerky.png",Animator.TYPE.NONE);this.routine=[new Movement(Movement.COND.X).add(Gizmo.TYPE.AIM,Gizmo.DEST.TO_X).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X),new Movement(Movement.COND.Y).add(Gizmo.TYPE.AIM,Gizmo.DEST.TO_Y).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_Y)]}EnmJerky.prototype=Object.create(Enemy.prototype);function EnmJuno(){Enemy.apply(this,arguments);this.dir=Math.PI;this.speed=2;this.effectH=false;this.hitPoint=75;this.score=750;this.anim=new Animator(this,"enmJuno.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE)]}EnmJuno.prototype=Object.create(Enemy.prototype);EnmJuno.prototype._recalculation=Actor.prototype.recalculation;EnmJuno.prototype.recalculation=function(){this._recalculation();this.minX=-this.field.width;this.minY=-this.field.height;this.maxX=this.field.width*2;this.maxY=this.field.height*2};function EnmTentacle(d,a,e){Chain.apply(this,arguments);this.speed=1.2;this.hitPoint=16;this.appears=false;this.anim=new Animator(this,"enmTentacle.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO)];this.push(new EnmTentacleHead(5+EnmTentacle.MAX_JOINT));for(var b=0;b<EnmTentacle.MAX_JOINT;b++){var c=5+EnmTentacle.MAX_JOINT-b;this.push(new EnmTentacleJoint(c))}this.score=150}EnmTentacle.prototype=Object.create(Chain.prototype);EnmTentacle.MAX_JOINT=8;EnmTentacle.MAX_RADIUS=16;EnmTentacle.DEG_STEP=Math.PI/2000;EnmTentacle.prototype.eject=function(){var a=this.next;while(a){a.eject();a=a.next}this.isGone=true;this.x=-this.width};EnmTentacle.prototype._move=Enemy.prototype.move;EnmTentacle.prototype.move=function(c){this.radius=this.hitPoint/2+8;this.scale=this.radius/EnmTentacle.MAX_RADIUS;this._move(c);this.radian=this.next.radian;if(this.appears){return}this.appears=true;var a=[];var b=this.next;while(b){a.push(b);b=b.next}return a};EnmTentacle.prototype.trigger=NOP;function EnmTentacleJoint(a){Chain.apply(this,arguments);this.radius=4;this.radian=0;this.speed=a;this.anim=new Animator(this,"enmTentacleJoint.png",Animator.TYPE.NONE)}EnmTentacleJoint.prototype=Object.create(Chain.prototype);EnmTentacleJoint.prototype.addRadian=function(a){this.radian=Math.trim(this.radian+a);if(this.next){}return this.radian};EnmTentacleJoint.prototype.move=function(f){var c=f.x-this.x;var b=f.y-this.y;var a=Math.close(this.radian,Math.atan2(b,c),EnmTentacle.DEG_STEP*this.speed);var e=Math.trim(a-this.radian);var d=this.prev;var h=this.addRadian(e);var g=this.radius+d.radius;this.x=d.x+Math.cos(h)*g;this.y=d.y+Math.sin(h)*g};EnmTentacleJoint.prototype.fate=NOP;EnmTentacleJoint.prototype.trigger=NOP;function EnmTentacleHead(a){EnmTentacleJoint.apply(this,arguments);this.anim=new Animator(this,"enmTentacleHead.png",Animator.TYPE.NONE)}EnmTentacleHead.prototype=Object.create(EnmTentacleJoint.prototype);EnmTentacleHead.prototype.trigger=Enemy.prototype.trigger;function EnmWaver(){Enemy.apply(this,arguments);this.dir=this.x<=0?0:Math.PI;this.step=Math.PI/30;this.speed=4;this.score=10;this.anim=new Animator(this,"enmWaver.png",Animator.TYPE.Y,1,8);this.routine=[new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L),new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R),new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R),new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L)]}EnmWaver.prototype=Object.create(Enemy.prototype);EnmWaver.RANGE=8;function Molten(){Enemy.apply(this,arguments);this.margin=Field.HALF_WIDTH;this.dir=0;this.speed=1;this.effectH=false;this.hitPoint=Number.MAX_SAFE_INTEGER;this.cycle=0;this.phase=Molten.PHASE.TARGET;this.rock=[];this.appears=false;this.anim=new Animator(this,"boss.Molten.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE)]}Molten.MAX_CYCLE=500;Molten.PHASE={OWN:0,TARGET:1,length:2};Molten.prototype=Object.create(Enemy.prototype);Molten.prototype._move=Enemy.prototype.move;Molten.prototype.move=function(b){this._move(b);if(Molten.MAX_CYCLE<this.cycle++){this.cycle=0;this.phase++;this.phase%=Molten.PHASE.length}if(this.appears){this.checkDestroy(b);return[]}this.appears=true;var a=new MoltenRock(this.field,this.x,this.y,this);this.rock=[a];return[a]};Molten.prototype.checkDestroy=function(b){var a=[];this.rock.forEach(function(c){if(!c.isGone){a.push(c)}});if(a.length==0){this.hitPoint=0;this.fate(b)}this.rock=a};function MoltenRock(c,a,d,b){Enemy.apply(this,arguments);this.margin=Field.HALF_WIDTH;this.parent=b;this.dir=0;this.speed=1.3;this.hitPoint=5;this.score=10;this.anim=new Animator(this,"boss.MoltenRock.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE)]}MoltenRock.prototype=Object.create(Enemy.prototype);MoltenRock.prototype._move=Enemy.prototype.move;MoltenRock.prototype.move=function(e){var a=[];var d=this.parent;if(d.phase==Molten.PHASE.OWN){a=this._move(d)}else{this._move(e)}if(this.absorbed&&this.hitPoint){var b=Math.trim(this.dir+Math.SQ);for(var c=0;c<3;c++){var f=new MoltenRock(this.field,this.x,this.y,d);f.dir=b;f.speed=this.speed*1.2;f.hitPoint=this.hitPoint;a.push(f);d.rock.push(f);b=Math.trim(b+Math.SQ)}}this.absorbed=false;return a};function Winding(c,a,d){Chain.apply(this,arguments);this.dir=-Math.PI;this.step=Math.SQ/100;this.radius=Winding.RADIUS;this.speed=2.2;this.hitPoint=300;this.margin=Field.HALF_WIDTH;this.ratio=Winding.RATIO_MAX;this.delta=-1;this.uncoil=false;this.anim=new Animator(this,"boss/winding.png",Animator.TYPE.NONE);this.routine=[new Movement(200).add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE),new Movement(20).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R)];this.appears=false;for(var b=0;b<Winding.MAX_JOINT;b++){this.push(new WindingChild(c,a,d))}}Winding.prototype=Object.create(Chain.prototype);Winding.RADIUS=16;Winding.RADIAN_STEP=Math.SQ;Winding.RATIO_MAX=50;Winding.MAX_JOINT=20;Winding.prototype._move=Enemy.prototype.move;Winding.prototype.move=function(d){var b=this._move(d);var a=Math.trim(this.dir-Math.SQ/2);this.rad=Math.trim(this.dir+Math.SQ);if(this.appears){var c=this.next;while(c){a+=Winding.RADIAN_STEP*this.ratio/100;c.radian=Math.trim(a);c=c.next}if(this.uncoil){this.ratio+=this.delta;if(this.ratio<=1){this.delta*=-1}else{if(Winding.RATIO_MAX<=this.ratio){this.uncoil=false;this.delta*=-1}}}return b}this.appears=true;var c=this.next;while(c){b.push(c);c=c.next}return b};Winding.prototype._fate=Actor.prototype.fate;Winding.prototype.fate=function(a){this._fate(a);this.uncoil=true};function WindingChild(b,a,c){Chain.apply(this,arguments);this.margin=Field.HALF_WIDTH;this.effectH=false;this.radius=WindingChild.RADIUS;this.anim=new Animator(this,"boss/winding.joint.png",Animator.TYPE.NONE)}WindingChild.RADIUS=4;WindingChild.prototype=Object.create(Chain.prototype);WindingChild.prototype.move=function(b){var a=this.prev;var c=this.radius+a.radius;this.x=a.x+Math.cos(this.radian)*c;this.y=a.y+Math.sin(this.radian)*c};WindingChild.prototype.fate=NOP;WindingChild.prototype.trigger=NOP;function Cascade(d,a,e){Chain.apply(this,arguments);this.anim=new Animator(this,"material/cascade.png",Animator.TYPE.NONE);this.radian=Math.SQ;this.radius=Cascade.RADIUS;this.appears=false;for(var b=0;b<Cascade.MAX_JOINT;b++){var c=(Cascade.MAX_JOINT-b)*6;this.push(new CascadeChild(d,a,e,c))}}Cascade.prototype=Object.create(Chain.prototype);Cascade.RADIUS=4;Cascade.MAX_JOINT=12;Cascade.prototype._move=Enemy.prototype.move;Cascade.prototype.move=function(c){this._move(c);if(this.appears){return}this.appears=true;var a=[];var b=this.next;while(b){a.push(b);b=b.next}return a};Cascade.prototype.fate=NOP;Cascade.prototype.trigger=NOP;function CascadeChild(c,a,d,b){Chain.apply(this,arguments);this.maxX=this.field.width+100;this.effectH=false;this.effectV=false;this.weight=b;this.radian=Math.SQ*0.9;this.radius=Cascade.RADIUS;this.step=0}CascadeChild.prototype=Object.create(Chain.prototype);CascadeChild.prototype.addRadian=function(a){this.radian=Math.trim(this.radian+a);if(this.next){}return this.radian};CascadeChild.prototype.move=function(c){var a=this.prev;var b=Math.trim(Math.SQ-this.radian)/(200+this.weight);this.step+=b;if(parseInt(b*1000)==0){this.step*=0.98}var e=Math.trim(this.radian+this.step);var d=this.radius+a.radius;if(e<0){e=0}this.radian=e;this.x=a.x+Math.cos(e)*d;this.y=a.y+Math.sin(e)*d};CascadeChild.prototype.draw=function(a){a.save();a.fillStyle="rgba(60, 200, 0, 0.8)";a.translate(this.x,this.y);a.beginPath();a.arc(0,0,this.radius,0,Math.PI2,false);a.fill();a.restore()};CascadeChild.prototype.fate=function(b){var c=Math.PI/400;this.step-=c;var a=this.next;while(a){a.step-=c*0.8;a=a.next}};CascadeChild.prototype.trigger=NOP;function Rewinder(c,a,d){Chain.apply(this,arguments);this.step=Math.SQ/100;this.radius=Rewinder.RADIUS;this.speed=2.2;this.hitPoint=Number.MAX_SAFE_INTEGER;this.margin=Field.HALF_WIDTH;this.ratio=Rewinder.RATIO_MAX;this.delta=-0.8;this.anim=new Animator(this,"material/cascade.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED,Gizmo.DEST.TO)];this.appears=false;for(var b=0;b<Rewinder.MAX_JOINT;b++){this.push(new RewinderChild(c,a,d))}}Rewinder.prototype=Object.create(Chain.prototype);Rewinder.RADIUS=4;Rewinder.RADIAN_STEP=Math.SQ;Rewinder.RATIO_MAX=100;Rewinder.MAX_JOINT=16;Rewinder.prototype._move=Enemy.prototype.move;Rewinder.prototype.move=function(d){var b=[];var a=Math.trim(this.radian+Math.SQ/2);this._move(d);if(this.appears){var c=this.next;while(c){a-=Rewinder.RADIAN_STEP*this.ratio/100;c.radian=Math.trim(a);c=c.next}this.ratio+=this.delta;if(this.ratio<=1){this.delta*=-1}else{if(Rewinder.RATIO_MAX<=this.ratio){this.delta*=-1}}return b}this.appears=true;var c=this.next;while(c){b.push(c);c=c.next}return b};Rewinder.prototype.fate=NOP;function RewinderChild(b,a,c){Chain.apply(this,arguments);this.margin=Field.HALF_WIDTH;this.effectH=false;this.effectV=false;this.radius=RewinderChild.RADIUS;this.anim=new Animator(this,"boss/winding.joint.png",Animator.TYPE.NONE)}RewinderChild.RADIUS=4;RewinderChild.prototype=Object.create(Chain.prototype);RewinderChild.prototype.move=function(b){var a=this.prev;var c=this.radius+a.radius;this.x=a.x+Math.cos(this.radian)*c;this.y=a.y+Math.sin(this.radian)*c};RewinderChild.prototype.fate=NOP;Enemy.LIST=[{name:"Waver",type:EnmWaver,img:"enmWaver.png",h:16},{name:"Battery",type:EnmBattery,img:"enmBattery.png"},{name:"Bouncer",type:EnmBouncer,img:"enmBouncer.png"},{name:"Hanker",type:EnmHanker,img:"enmHanker.png"},{name:"Jerky",type:EnmJerky,img:"enmJerky.png"},{name:"Juno",type:EnmJuno,img:"enmJuno.png"},{name:"Crab",type:EnmCrab,img:"enmCrab.png"},{name:"Tentacle",type:EnmTentacle,img:"enmTentacle.png"},{name:"Dragon",type:EnmDragonHead,img:"enmDragonHead.png"},{name:"Waver(formation)",type:EnmWaver,img:"enmWaver.png",h:16,formation:true},{name:"Molten",type:Molten,img:"boss.Molten.png"},{name:"Winding",type:Winding,img:"boss/Winding.png"},{name:"Cascade",type:Cascade,img:"material/cascade.icon.png"},{name:"Rewinder",type:Rewinder,img:"material/cascade.icon.png"}];Stage.LIST=[new Stage(Stage.SCROLL.OFF,"stage00map.png",[new StageBg("stage01bg0.png",0.7),new StageBg("stage01bg1.png",0.9,0,0.02),new StageFg("stage00bg.png")]).setBgm("bgm-edo-beth"),new Stage(Stage.SCROLL.OFF,"stage01map.png",[new StageBg("stage01bg1.png",0.7,0,0.02),new StageBg("stage01bg0.png",0.6),new StageFg("stage01bg.png",1.3)]).setBgm("bgm-MadNightDance","bgm-edo-omega-zero"),new Stage(Stage.SCROLL.LOOP,"stage00map.png",[new StageBg("stage01bg0.png",0.7),new StageBg("stage01bg1.png",0.9,0,0.02),new StageFg("stage00bg.png")]).setBgm("bgm-edo-beth"),new Stage(Stage.SCROLL.ON,"stage02map.png",[new StageBg("stage01bg1.png",0.7),new StageBg("stage01bg0.png",0.9),new StageFg("stage02bg.png")]).setBgm("bgm-pierrot-cards","bgm-edo-omega-zero")];AudioMixer.INSTANCE.addAll(["sfx-fire","sfx-explosion","sfx-absorb","bgm-edo-beth","bgm-MadNightDance","bgm-pierrot-cards","bgm-edo-omega-zero"]);