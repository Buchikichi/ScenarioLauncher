function Bullet(b,a,c){Actor.apply(this,arguments);this.speed=4;this.width=8;this.height=8;this.recalculation()}Bullet.prototype=Object.create(Actor.prototype);Bullet.prototype.drawNormal=function(a){a.save();a.beginPath();a.fillStyle="rgba(120, 200, 255, 0.7)";a.arc(this.x,this.y,this.width/3,0,Math.PI*2,false);a.fill();a.restore()};Bullet.prototype.drawExplosion=function(a){};function Enemy(){Actor.apply(this,arguments);this.routine=null;this.routineIx=0;this.routineCnt=0;this.triggerCycle=0;this.constraint=false}Enemy.prototype=Object.create(Actor.prototype);Enemy.TRIGGER_CYCLE=30;Enemy.TRIGGER_ALLOWANCE=100;Enemy.MAX_TYPE=127;Enemy.LIST=[{name:"Waver",type:EnmWaver,img:"enmWaver.png",h:16},{name:"Battery",type:EnmBattery,img:"enmBattery.png"},{name:"Bouncer",type:EnmBouncer,img:"enmBouncer.png"},{name:"Hanker",type:EnmHanker,img:"enmHanker.png"},{name:"Jerky",type:EnmJerky,img:"enmJerky.png"},{name:"Juno",type:EnmJuno,img:"enmJuno.png"},{name:"Tentacle",type:EnmTentacle,img:"enmTentacle.png"},{name:"Dragon",type:EnmDragonHead,img:"enmDragonHead.png"},{name:"Waver(formation)",type:EnmWaver,img:"enmWaver.png",h:16,formation:true},{name:"Cascade",type:Cascade,img:"material.Cascade.icon.png"}];Enemy.assign=function(c,a,d){var b=Object.assign({},Enemy.LIST[c%Enemy.LIST.length]);b.x=a;b.y=d;return b};Enemy.prototype.trigger=function(){if(this.triggerCycle++<Enemy.TRIGGER_CYCLE){return false}this.triggerCycle=0;return true};Enemy.prototype.fire=function(e){var b=new Bullet(this.field,this.x,this.y);var f=this.calcDistance(e);var d=f/b.speed*this.field.landform.speed;var c=e.x-this.x+d;var a=e.y-this.y;b.dir=Math.atan2(a,c);return[b]};Enemy.prototype.actor_move=Actor.prototype.move;Enemy.prototype.move=function(c){var a=this;if(this.routine){var b=this.routine[this.routineIx];b.tick(this,c)}this.actor_move(c);if(this.trigger()&&Enemy.TRIGGER_ALLOWANCE<this.calcDistance(c)){if(this.constraint){return}return this.fire(c)}};function Chain(b,a,c){Enemy.apply(this,arguments);this.prev=null;this.next=null}Chain.prototype=Object.create(Enemy.prototype);Chain.prototype.unshift=function(a){a.next=this;a.prev=this.prev;if(this.prev){this.prev.next=a}this.prev=a;return this};Chain.prototype.push=function(a){a.prev=this;a.next=this.next;if(this.next){this.next.prev=a}this.next=a;return this};Chain.prototype.remove=function(){this.prev.next=this.next;this.next.prev=this.prev;return this.next};function EnmBattery(){Enemy.apply(this,arguments);this.speed=0;this.hitPoint=1;this.score=10;this.anim=new Animator(this,"enmBattery.png",Animator.TYPE.NONE);this.base=new Image();this.base.src="img/enmBatteryBase.png";this.routine=[new Movement().add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.FIXED,Gizmo.DEST.TO)];this.isInverse=false;if(this.field&&this.field.landform){var a=this.field.landform;var b={x:this.x,y:this.y+Landform.BRICK_WIDTH};a.hitTest(b);this.isInverse=!b.isHitWall}}EnmBattery.prototype=Object.create(Enemy.prototype);EnmBattery.prototype._drawNormal=Enemy.prototype.drawNormal;EnmBattery.prototype.drawNormal=function(a){this._drawNormal(a);a.save();a.translate(this.x,this.y);if(this.isInverse){a.rotate(Math.PI)}a.drawImage(this.base,-this.hW,-this.hH);a.restore()};function EnmBouncer(){Enemy.apply(this,arguments);this.dx=-(Math.random()*3+1);this.hitPoint=3;this.score=50;this.shuttle=parseInt(Math.random()*4)+1;this.img.src="img/enmBouncer.png"}EnmBouncer.prototype=Object.create(Enemy.prototype);EnmBouncer.prototype._move=Enemy.prototype.move;EnmBouncer.prototype.move=function(a){if(this.shuttle&&(this.x<0||this.field.width<this.x)){this.dx=-this.dx;this.shuttle--}if(this.isHitWall){this.x=this.svX;this.y=this.svY}if(this.field.height<=this.y||this.isHitWall){this.dy=-this.dy}else{this.dy+=0.3}return this._move(a)};EnmBouncer.prototype.drawNormal=function(b){var c=Math.abs(this.dy);var d=c<5?0.75+c/20:1;var a=this.y/d;b.save();b.translate(this.x,this.y);b.scale(1,d);b.drawImage(this.img,-this.hW,-this.hH);b.restore()};function EnmDragonBody(){Enemy.apply(this,arguments);this.effect=false;this.hitPoint=Number.MAX_SAFE_INTEGER;this.score=0;this.anim=new Animator(this,"enmDragonBody.png",Animator.TYPE.NONE)}EnmDragonBody.prototype=Object.create(Enemy.prototype);EnmDragonBody.prototype._recalculation=Actor.prototype.recalculation;EnmDragonBody.prototype.recalculation=function(){this._recalculation();this.minX=-this.field.width;this.minY=-this.field.height;this.maxX=this.field.width*2;this.maxY=this.field.height*2};EnmDragonBody.prototype.trigger=NOP;function EnmDragonHead(){Enemy.apply(this,arguments);if(0<this.x){this.x+=50}else{this.x-=50}this.speed=1.8;this.effect=false;this.hitPoint=200;this.score=1000;this.radian=Math.PI;this.appears=false;this.anim=new Animator(this,"enmDragonHead.png",Animator.TYPE.NONE);this.locus=[];this.body=[];for(var b=0;b<EnmDragonHead.CNT_OF_BODY*EnmDragonHead.STP_OF_BODY;b++){this.locus.push({x:this.x,y:this.y,radian:this.radian});if(b%EnmDragonHead.STP_OF_BODY==0){var a=new EnmDragonBody(this.field,this.x,this.y);this.body.push(a)}}}EnmDragonHead.prototype=Object.create(Enemy.prototype);EnmDragonHead.CNT_OF_BODY=10;EnmDragonHead.STP_OF_BODY=16;EnmDragonHead.prototype._recalculation=Actor.prototype.recalculation;EnmDragonHead.prototype.recalculation=function(){this._recalculation();this.minX=-this.field.width;this.minY=-this.field.height;this.maxX=this.field.width*2;this.maxY=this.field.height*2};EnmDragonHead.prototype._eject=Actor.prototype.eject;EnmDragonHead.prototype.eject=function(){this._eject();this.body.forEach(function(a){a.hitPoint=0;a.explosion=Actor.MAX_EXPLOSION})};EnmDragonHead.prototype._move=Enemy.prototype.move;EnmDragonHead.prototype.move=function(f){var b=Math.trim(this.radian+this.closeGap(f)*1.8);this.dir=b;this.radian=b;this._move(f);for(var e=0;e<EnmDragonHead.CNT_OF_BODY;e++){var a=this.body[e];var c=(e+1)*EnmDragonHead.STP_OF_BODY-1;var d=this.locus[c];a.x=d.x;a.y=d.y;a.radian=d.radian}this.locus.unshift({x:this.x,y:this.y,radian:this.radian});this.locus.pop();if(this.appears){return}this.appears=true;return this.body};function EnmFormation(){Actor.apply(this,arguments);this.effect=false;this.bonus=800;this.score=this.bonus;this.steps=0;this.count=0;this.enemies=[]}EnmFormation.prototype=Object.create(Actor.prototype);EnmFormation.STEP=5;EnmFormation.prototype.setup=function(c,b){for(var a=0;a<b;a++){this.enemies.push(new c(this.field,this.x,this.y))}return this};EnmFormation.prototype.checkDestroy=function(){var b=this;var a=[];this.enemies.forEach(function(c){if(c.hitPoint==0){return}a.push(c);b.x=c.x;b.y=c.y});this.enemies=a;if(a.length==0&&this.explosion==0){this.explosion=Actor.MAX_EXPLOSION*4;return}};EnmFormation.prototype._move=Actor.prototype.move;EnmFormation.prototype.move=function(a){this._move(a);if(this.enemies.length<=this.count){this.checkDestroy();return}if(this.steps++%EnmFormation.STEP!=0){return}return[this.enemies[this.count++]]};EnmFormation.prototype.drawExplosion=function(a){a.fillStyle="rgba(240, 240, 255, .8)";a.fillText(this.bonus,this.x,this.y)};function EnmHanker(){Enemy.apply(this,arguments);this.speed=1.5;this.hitPoint=8;this.score=100;this.anim=new Animator(this,"enmHanker.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.AIM,Gizmo.DEST.ROTATE).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO)]}EnmHanker.prototype=Object.create(Enemy.prototype);function EnmJerky(){Enemy.apply(this,arguments);this.speed=3;this.hitPoint=1;this.score=10;this.anim=new Animator(this,"enmJerky.png",Animator.TYPE.NONE);this.routine=[new Movement(Movement.COND.X).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_X),new Movement(Movement.COND.Y).add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO_Y)]}EnmJerky.prototype=Object.create(Enemy.prototype);function EnmJuno(){Enemy.apply(this,arguments);this.dir=Math.PI;this.speed=2;this.effect=false;this.hitPoint=75;this.score=750;this.anim=new Animator(this,"enmJuno.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.CHASE,Gizmo.DEST.ROTATE)]}EnmJuno.prototype=Object.create(Enemy.prototype);EnmJuno.prototype._recalculation=Actor.prototype.recalculation;EnmJuno.prototype.recalculation=function(){this._recalculation();this.minX=-this.field.width;this.minY=-this.field.height;this.maxX=this.field.width*2;this.maxY=this.field.height*2};function Gizmo(b,a){this.type=b;this.destination=a}Gizmo.TYPE={FIXED:0,OWN:1,AIM:2,CHASE:3};Gizmo.DEST={TO:0,TO_X:1,TO_Y:2,ROTATE:3,ROTATE_L:4,ROTATE_R:5};Gizmo.prototype.tick=function(g,e){var d=g.field.landform;if(this.type==Gizmo.TYPE.FIXED){return}if(this.type==Gizmo.TYPE.OWN){if(this.destination==Gizmo.DEST.ROTATE_L){g.dir-=g.step}else{if(this.destination==Gizmo.DEST.ROTATE_R){g.dir+=g.step}}return}var b=e.x-g.x;var a=e.y-g.y;if(Math.abs(b)<=g.speed){b=0}if(Math.abs(a)<=g.speed){a=0}if(this.type==Gizmo.TYPE.AIM){if(this.destination==Gizmo.DEST.ROTATE){var f=g.calcDistance(e);if(g.speed<f){g.radian=Math.atan2(a,b)}}return}if(this.type==Gizmo.TYPE.CHASE){if(this.destination==Gizmo.DEST.TO){g.dir=Math.atan2(a,b)}else{if(this.destination==Gizmo.DEST.TO_X&&b){g.dir=Math.atan2(0,b);g.radian=g.dir}else{if(this.destination==Gizmo.DEST.TO_Y&&a){g.dir=Math.atan2(a,0);g.radian=g.dir}else{if(this.destination==Gizmo.DEST.ROTATE){var c=Math.PI/60;g.dir=Math.close(g.dir,Math.atan2(a,b),c);g.radian=g.dir}}}}}};function Movement(a){var b=parseInt(a);this.cond=a;this.count=b==a?b:null;this.list=[]}Movement.COND={X:"x",Y:"y"};Movement.prototype.add=function(a,b){this.list.push(new Gizmo(a,b));return this};Movement.prototype.isValid=function(d,c){if(!this.cond){return}if(this.count){if(d.routineCnt++<this.count){return true}d.routineCnt=0;return false}var b=c.x-d.x;var a=c.y-d.y;if(this.cond==Movement.COND.X&&Math.abs(b)<=d.speed){return false}if(this.cond==Movement.COND.Y&&Math.abs(a)<=d.speed){return false}return true};Movement.prototype.tick=function(b,a){this.list.forEach(function(c){c.tick(b,a)});if(!this.isValid(b,a)){b.routineIx++;if(b.routine.length<=b.routineIx){b.routineIx=0}}};function EnmTentacle(d,a,e){Chain.apply(this,arguments);this.speed=1.2;this.hitPoint=16;this.appears=false;this.anim=new Animator(this,"enmTentacle.png",Animator.TYPE.NONE);this.routine=[new Movement().add(Gizmo.TYPE.CHASE,Gizmo.DEST.TO)];this.push(new EnmTentacleHead(5+EnmTentacle.MAX_JOINT));for(var b=0;b<EnmTentacle.MAX_JOINT;b++){var c=5+EnmTentacle.MAX_JOINT-b;this.push(new EnmTentacleJoint(c))}this.score=150}EnmTentacle.prototype=Object.create(Chain.prototype);EnmTentacle.MAX_JOINT=8;EnmTentacle.MAX_RADIUS=16;EnmTentacle.DEG_STEP=Math.PI/2000;EnmTentacle.prototype.eject=function(){var a=this.next;while(a){a.eject();a=a.next}this.isGone=true;this.x=-this.width};EnmTentacle.prototype._move=Enemy.prototype.move;EnmTentacle.prototype.move=function(c){this.radius=this.hitPoint/2+8;this.scale=this.radius/EnmTentacle.MAX_RADIUS;this._move(c);this.radian=this.next.radian;if(this.appears){return}this.appears=true;var a=[];var b=this.next;while(b){a.push(b);b=b.next}return a};EnmTentacle.prototype.trigger=NOP;function EnmTentacleJoint(a){Chain.apply(this,arguments);this.radius=4;this.radian=0;this.speed=a;this.anim=new Animator(this,"enmTentacleJoint.png",Animator.TYPE.NONE)}EnmTentacleJoint.prototype=Object.create(Chain.prototype);EnmTentacleJoint.prototype.addRadian=function(a){this.radian=Math.trim(this.radian+a);if(this.next){}return this.radian};EnmTentacleJoint.prototype.move=function(f){var c=f.x-this.x;var b=f.y-this.y;var a=Math.close(this.radian,Math.atan2(b,c),EnmTentacle.DEG_STEP*this.speed);var e=Math.trim(a-this.radian);var d=this.prev;var h=this.addRadian(e);var g=this.radius+d.radius;this.x=d.x+Math.cos(h)*g;this.y=d.y+Math.sin(h)*g};EnmTentacleJoint.prototype.fate=NOP;EnmTentacleJoint.prototype.trigger=NOP;function EnmTentacleHead(a){EnmTentacleJoint.apply(this,arguments);this.anim=new Animator(this,"enmTentacleHead.png",Animator.TYPE.NONE)}EnmTentacleHead.prototype=Object.create(EnmTentacleJoint.prototype);EnmTentacleHead.prototype.trigger=Enemy.prototype.trigger;function EnmWaver(){Enemy.apply(this,arguments);this.dir=this.x<=0?0:Math.PI;this.step=Math.PI/30;this.speed=4;this.score=10;this.anim=new Animator(this,"enmWaver.png",Animator.TYPE.Y,1,8);this.routine=[new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L),new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R),new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_R),new Movement(EnmWaver.RANGE).add(Gizmo.TYPE.OWN,Gizmo.DEST.ROTATE_L)]}EnmWaver.prototype=Object.create(Enemy.prototype);EnmWaver.RANGE=8;function Cascade(d,a,e){Chain.apply(this,arguments);this.anim=new Animator(this,"material.Cascade.png",Animator.TYPE.NONE);this.radian=Math.SQ;this.radius=Cascade.RADIUS;this.appears=false;for(var b=0;b<Cascade.MAX_JOINT;b++){var c=(Cascade.MAX_JOINT-b)*6;this.push(new CascadeChild(d,a,e,c))}}Cascade.prototype=Object.create(Chain.prototype);Cascade.RADIUS=4;Cascade.MAX_JOINT=12;Cascade.prototype._move=Enemy.prototype.move;Cascade.prototype.move=function(c){this._move(c);if(this.appears){return}this.appears=true;var a=[];var b=this.next;while(b){a.push(b);b=b.next}return a};Cascade.prototype.fate=NOP;Cascade.prototype.trigger=NOP;function CascadeChild(c,a,d,b){Chain.apply(this,arguments);this.maxX=this.field.width+100;this.effect=false;this.weight=b;this.radian=Math.SQ*0.9;this.radius=Cascade.RADIUS;this.step=0}CascadeChild.prototype=Object.create(Chain.prototype);CascadeChild.prototype.addRadian=function(a){this.radian=Math.trim(this.radian+a);if(this.next){}return this.radian};CascadeChild.prototype.move=function(c){var a=this.prev;var b=Math.trim(Math.SQ-this.radian)/(200+this.weight);this.step+=b;if(parseInt(b*1000)==0){this.step*=0.98}var e=Math.trim(this.radian+this.step);var d=this.radius+a.radius;if(e<0){e=0}this.radian=e;this.x=a.x+Math.cos(e)*d;this.y=a.y+Math.sin(e)*d};CascadeChild.prototype.draw=function(a){a.save();a.fillStyle="rgba(60, 200, 0, 0.8)";a.translate(this.x,this.y);a.beginPath();a.arc(0,0,this.radius,0,Math.PI2,false);a.fill();a.restore()};CascadeChild.prototype.fate=function(b){var c=Math.PI/400;this.step-=c;var a=this.next;while(a){a.step-=c*0.8;a=a.next}};CascadeChild.prototype.trigger=NOP;