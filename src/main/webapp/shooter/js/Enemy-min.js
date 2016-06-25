function Enemy(){Actor.apply(this,arguments);this.triggerCycle=0}Enemy.prototype=Object.create(Actor.prototype);Enemy.TRIGGER_CYCLE=30;Enemy.LIST=[{name:"Waver",type:EnmWaver,img:"enmWaver.png"},{name:"Bouncer",type:EnmBouncer,img:"enmBouncer.png"},{name:"Hanker",type:EnmHanker,img:"enmHanker.png"},{name:"Tentacle",type:EnmTentacle,img:"enmTentacle.png"},{name:"Dragon",type:EnmDragonHead,img:"enmDragonHead.png"},{name:"Waver(formation)",type:EnmWaver,img:"enmWaver.png",formation:true}];Enemy.prototype.trigger=function(){if(this.triggerCycle++<Enemy.TRIGGER_CYCLE){return false}this.triggerCycle=0;return true};function Chain(b,a,c){Enemy.apply(this,arguments);this.prev=null;this.next=null}Chain.prototype=Object.create(Enemy.prototype);Chain.prototype.unshift=function(a){a.next=this;a.prev=this.prev;if(this.prev){this.prev.next=a}this.prev=a;return this};Chain.prototype.push=function(a){a.prev=this;a.next=this.next;if(this.next){this.next.prev=a}this.next=a;return this};Chain.prototype.remove=function(){this.prev.next=this.next;this.next.prev=this.prev;return this.next};function EnmBouncer(){Enemy.apply(this,arguments);this.dx=-(Math.random()*3+1);this.hitPoint=3;this.score=50;this.shuttle=parseInt(Math.random()*4)+1;this.img.src="img/enmBouncer.png"}EnmBouncer.prototype=Object.create(Enemy.prototype);EnmBouncer.prototype._move=Enemy.prototype.move;EnmBouncer.prototype.move=function(a){if(this.shuttle&&(this.x<0||this.field.width<this.x)){this.dx=-this.dx;this.shuttle--}if(this.field.height<=this.y){this.dy=-this.dy}else{this.dy+=0.3}this._move(a)};EnmBouncer.prototype.drawNormal=function(b){var c=Math.abs(this.dy);var d=c<5?0.75+c/20:1;var a=this.y/d;b.save();b.translate(this.x,this.y);b.scale(1,d);b.drawImage(this.img,-this.hW,-this.hH);b.restore()};function EnmDragonBody(){Enemy.apply(this,arguments);this.hitPoint=Number.MAX_SAFE_INTEGER;this.score=0;this.img.src="img/enmDragonBody.png"}EnmDragonBody.prototype=Object.create(Enemy.prototype);EnmDragonBody.prototype.move=function(a){if(0<this.explosion){this.explosion--;if(this.explosion==0){this.eject()}}};EnmDragonBody.prototype.trigger=function(){};function EnmDragonHead(){Enemy.apply(this,arguments);this.speed=1.8;this.hitPoint=200;this.score=1000;this.radian=Math.PI;this.img.src="img/enmDragonHead.png";this.locus=[];this.body=[];for(var b=0;b<EnmDragonHead.CNT_OF_BODY*EnmDragonHead.STP_OF_BODY;b++){this.locus.push({x:this.x,y:this.y,radian:this.radian});if(b%EnmDragonHead.STP_OF_BODY==0){var a=new EnmDragonBody(this.field,this.x,this.y);this.body.push(a)}}}EnmDragonHead.prototype=Object.create(Enemy.prototype);EnmDragonHead.CNT_OF_BODY=10;EnmDragonHead.STP_OF_BODY=16;EnmDragonHead.prototype._recalculation=Actor.prototype.recalculation;EnmDragonHead.prototype.recalculation=function(){this._recalculation();this.minX=-this.field.width;this.minY=-this.field.height;this.maxX=this.field.width*2;this.maxY=this.field.height*2};EnmDragonHead.prototype._eject=Actor.prototype.eject;EnmDragonHead.prototype.eject=function(){this._eject();this.body.forEach(function(a){a.hitPoint=0;a.explosion=Actor.MAX_EXPLOSION})};EnmDragonHead.prototype._move=Enemy.prototype.move;EnmDragonHead.prototype.move=function(f){var b=this.trimRadian(this.radian+this.closeGap(f)*1.8);this.dir=b;this.radian=b;this._move(f);for(var e=0;e<EnmDragonHead.CNT_OF_BODY;e++){var a=this.body[e];var c=(e+1)*EnmDragonHead.STP_OF_BODY-1;var d=this.locus[c];a.x=d.x;a.y=d.y;a.radian=d.radian}this.locus.unshift({x:this.x,y:this.y,radian:this.radian});this.locus.pop()};function EnmFormation(){Actor.apply(this,arguments);this.bonus=800;this.score=this.bonus;this.steps=0;this.count=0;this.enemies=[]}EnmFormation.prototype=Object.create(Actor.prototype);EnmFormation.STEP=5;EnmFormation.prototype.setup=function(c,b){for(var a=0;a<b;a++){this.enemies.push(new c(this.field,this.x,this.y))}return this};EnmFormation.prototype.checkDestroy=function(){var b=this;var a=[];this.enemies.forEach(function(c){if(c.hitPoint==0){return}a.push(c);b.x=c.x;b.y=c.y});this.enemies=a;if(a.length==0&&this.explosion==0){this.explosion=Actor.MAX_EXPLOSION*4;return}};EnmFormation.prototype._move=Actor.prototype.move;EnmFormation.prototype.move=function(b){this._move(b);if(this.enemies.length<=this.count){this.checkDestroy();return}if(this.steps++%EnmFormation.STEP!=0){return}var a=this.enemies[this.count];this.count++;return a};EnmFormation.prototype.drawExplosion=function(a){a.fillStyle="rgba(240, 240, 255, .8)";a.fillText(this.bonus,this.x,this.y)};function EnmHanker(){Enemy.apply(this,arguments);this.speed=2;this.hitPoint=8;this.score=100;this.img.src="img/enmHanker.png"}EnmHanker.prototype=Object.create(Enemy.prototype);EnmHanker.prototype._move=Enemy.prototype.move;EnmHanker.prototype.move=function(a){this.aim(a);this.radian=this.dir;this._move(a)};function EnmTentacle(c,a,d){Chain.apply(this,arguments);this.speed=0.8;this.hitPoint=16;this.img.src="img/enmTentacle.png";this.push(new EnmTentacleHead(0.8));for(var b=1;b<EnmTentacle.MAX_JOINT;b++){this.push(new EnmTentacleJoint(0.3))}this.push(new EnmTentacleJoint(1));this.score=150}EnmTentacle.prototype=Object.create(Chain.prototype);EnmTentacle.MAX_JOINT=8;EnmTentacle.MAX_RADIUS=16;EnmTentacle.prototype.eject=function(){var a=this.next;while(a){a.eject();a=a.next}this.isGone=true;this.x=-this.width};EnmTentacle.prototype._move=Enemy.prototype.move;EnmTentacle.prototype.move=function(a){this.aim(a);this._move(a)};EnmTentacle.prototype.drawNormal=function(a){this.radius=this.hitPoint/2+8;var b=this.radius/EnmTentacle.MAX_RADIUS;a.save();a.translate(this.x,this.y);if(this.next){a.rotate(this.next.radian)}a.scale(b,b);a.drawImage(this.img,-this.radius,-this.radius);a.restore()};EnmTentacle.prototype.trigger=function(){};function EnmTentacleJoint(a){Chain.apply(this,arguments);this.radius=4;this.radian=0;this.speed=a;this.img.src="img/enmTentacleJoint.png"}EnmTentacleJoint.prototype=Object.create(Chain.prototype);EnmTentacleJoint.prototype.addRadian=function(a){this.radian=this.trimRadian(this.radian+a);if(this.next){this.next.addRadian(a)}return this.radian};EnmTentacleJoint.prototype.move=function(c){var b=this.prev;var a=this.closeGap(c)*0.7;if(b instanceof EnmTentacleJoint){a*=0.3}var e=this.addRadian(a);var d=this.radius+b.radius;this.x=b.x+Math.cos(e)*d;this.y=b.y+Math.sin(e)*d};EnmTentacleJoint.prototype.fate=function(){};EnmTentacleJoint.prototype.trigger=function(){};function EnmTentacleHead(a){EnmTentacleJoint.apply(this,arguments);this.img.src="img/enmTentacleHead.png"}EnmTentacleHead.prototype=Object.create(EnmTentacleJoint.prototype);EnmTentacleHead.prototype.trigger=Enemy.prototype.trigger;function EnmWaver(){Enemy.apply(this,arguments);this.dir=this.x<=0?0:Math.PI;this.step=Math.PI/30;this.speed=5;this.cnt=0;this.direction=1;this.score=10;this.img.src="img/enmWaver.png"}EnmWaver.prototype=Object.create(Enemy.prototype);EnmWaver.RANGE=8;EnmWaver.prototype._move=Enemy.prototype.move;EnmWaver.prototype.move=function(a){if(EnmWaver.RANGE<Math.abs(this.cnt)){this.direction=-this.direction}this.dir+=this.direction*this.step;this.cnt+=this.direction;this._move()};