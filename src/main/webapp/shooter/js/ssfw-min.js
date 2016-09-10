function Actor(c,a,d){var b=this;this.field=c;this.x=a;this.y=d;this.dx=0;this.dy=0;this.dir=null;this.radian=0;this.width=16;this.height=16;this.margin=0;this.gravity=0;this.reaction=0;this.speed=1;this.effectH=true;this.effectV=true;this.hitPoint=1;this.absorbed=false;this.score=0;this.isHitWall=false;this.recalculation();this.img=new Image();this.img.onload=function(){b.width=this.width;b.height=this.height;b.recalculation()};this.sfx="sfx-explosion";this.sfxAbsorb="sfx-absorb";this.enter()}Actor.MAX_EXPLOSION=12;Actor.DEG_STEP=Math.PI/180;Actor.prototype.recalculation=function(){this.hW=this.width/2;this.hH=this.height/2;this.minX=-this.width-this.margin;this.minY=-this.height-this.margin;this.maxX=this.field.width+this.width+this.margin;this.maxY=this.field.height+this.height+this.margin};Actor.prototype.enter=function(){this.explosion=0;this.isGone=false};Actor.prototype.eject=function(){this.isGone=true;this.x=-this.field.width};Actor.prototype.aim=function(c){if(c){var d=this.calcDistance(c);if(this.speed<d){var b=c.x-this.x;var a=c.y-this.y;this.dir=Math.atan2(a,b)}}else{this.dir=null}return this};Actor.prototype.closeGap=function(d){var b=d.x-this.x;var a=d.y-this.y;var c=Math.trim(this.radian-Math.atan2(a,b));if(Math.abs(c)<=Actor.DEG_STEP){return 0}if(0<c){return -Actor.DEG_STEP}return Actor.DEG_STEP};Actor.prototype.move=function(a){if(0<this.explosion){this.explosion--;if(this.explosion==0){this.eject();return}}this.svX=this.x;this.svY=this.y;if(this.dir!=null){this.x+=Math.cos(this.dir)*this.speed;this.y+=Math.sin(this.dir)*this.speed}if(this.gravity!=0){var b=this.field.landform.scanFloor(this)-this.hH;if(this.y<b){this.dy+=this.gravity}else{if(b<this.y){this.y=b;this.dy*=-this.reaction;this.radian=this.field.landform.getHorizontalAngle(this)}}}this.x+=this.dx*this.speed;this.y+=this.dy*this.speed;if(this.anim){this.anim.next(this.dir)}};Actor.prototype.drawNormal=function(a){if(this.anim){this.anim.draw(a)}};Actor.prototype.drawExplosion=function(a){var b=this.explosion;a.fillStyle="rgba(255, 0, 0, 0.7)";a.save();a.translate(this.x,this.y);a.beginPath();a.arc(0,0,b,0,Math.PI2,false);a.fill();a.restore()};Actor.prototype.draw=function(a){if(this.isGone){return}if(0<this.explosion){this.drawExplosion(a)}else{this.drawNormal(a)}};Actor.prototype.isHit=function(d){if(this.isGone||0<this.explosion||0<d.explosion){return false}var e=this.calcDistance(d);var b=this.hW+d.hW;var c=this.hH+d.hH;var a=(b+c)/3;if(e<a){this.fate(d);d.fate(this);return true}return false};Actor.prototype.calcDistance=function(c){var b=this.x-c.x;var a=this.y-c.y;return Math.sqrt(b*b+a*a)};Actor.prototype.fate=function(a){if(this.isGone||this.explosion){return}this.hitPoint--;if(0<this.hitPoint){this.absorb(a);return}this.explosion=Actor.MAX_EXPLOSION;var b=(this.x-Field.HALF_WIDTH)/Field.HALF_WIDTH;AudioMixer.INSTANCE.play(this.sfx,0.2,false,b)};Actor.prototype.absorb=function(b){this.absorbed=true;if(this.sfxAbsorb){var a=this.field.ctx;a.fillStyle="rgba(255, 200, 0, 0.4)";a.save();a.translate(b.x,b.y);a.beginPath();a.arc(0,0,5,0,Math.PI2,false);a.fill();a.restore();var c=(this.x-Field.HALF_WIDTH)/Field.HALF_WIDTH;AudioMixer.INSTANCE.play(this.sfxAbsorb,0.3,false,c)}};function NOP(){}function Animator(c,e,b){var d=this;var a=arguments.length;this.actor=c;this.type=b;this.numX=3<a?arguments[3]:1;this.numY=4<a?arguments[4]:1;this.patNum=0;this.img=new Image();this.img.onload=function(){d.width=this.width/d.numX;d.height=this.height/d.numY;d.hW=d.width/2;d.hH=d.height/2;c.width=d.width;c.height=d.height;c.hW=d.hW;c.hH=d.hH;if(c.recalculation){c.recalculation()}};this.img.src="img/"+e}Animator.TYPE={NONE:0,X:1,Y:2,XY:3,H:4,V:5};Animator.prototype.next=function(c){if(this.type==Animator.TYPE.V&&0.1<Math.abs(this.patNum)){if(this.patNum<0){this.patNum+=0.1}else{this.patNum-=0.1}}if(c!=null){if(this.type==Animator.TYPE.X){this.patNum+=Math.cos(c)*0.5;var b=Math.floor(this.patNum);if(b<0){this.patNum=this.numX-0.1}else{if(this.numX<=b){this.patNum=0}}}else{if(this.type==Animator.TYPE.Y){this.patNum+=Math.sin(c)*0.5;var b=Math.floor(this.patNum);if(b<0){this.patNum=this.numY-0.1}else{if(this.numY<=b){this.patNum=0}}}else{if(this.type==Animator.TYPE.V){var a=Math.floor(this.numY/2);this.patNum+=Math.sin(c)/3;if(this.patNum<-a){this.patNum=-a}else{if(a<this.patNum){this.patNum=a}}}}}}this.patNum*=1000;this.patNum=Math.round(this.patNum)/1000};Animator.prototype.draw=function(b){var d=this.actor;var a=this.width;var c=this.height;var f=0;var e=0;if(this.type==Animator.TYPE.X){f=a*Math.floor(this.patNum)}else{if(this.type==Animator.TYPE.Y){e=c*Math.floor(this.patNum)}else{if(this.type==Animator.TYPE.V){e=c*(parseInt(this.patNum)+(this.numY?parseInt(this.numY/2):0))}}}b.save();b.translate(d.x,d.y);b.rotate(d.radian);if(d.scale){b.scale(d.scale,d.scale)}b.drawImage(this.img,f,e,a,c,-this.hW,-this.hH,a,c);b.restore()};"use strict";function AudioMixer(){if(window.AudioContext||window.webkitAudioContext){this.ctx=new (window.AudioContext||window.webkitAudioContext)()}this.max=0;this.loaded=0;this.dic=[];this.bgm=null}AudioMixer.INSTANCE=new AudioMixer();AudioMixer.prototype.isComplete=function(){return 0<this.max&&this.max==this.loaded};AudioMixer.prototype.add=function(d){var b=this;var a=this.ctx;var f=this.dic;var e=new XMLHttpRequest();var c="audio/"+d+".mp3";this.max++;e.open("GET",c,true);e.responseType="arraybuffer";e.addEventListener("load",function(){if(!a){var h=new Audio();h.src=c;f[d]=h;b.loaded++;return}var g=e.response;a.decodeAudioData(g,function(i){f[d]=i;b.loaded++})});e.send()};AudioMixer.prototype.addAll=function(b){var a=this;b.forEach(function(c){a.add(c)})};AudioMixer.prototype.play=function(i){if(!this.dic[i]){return}var f=arguments.length;var d=1<f?arguments[1]:1;var g=2<f?arguments[2]:false;var h=3<f?arguments[3]:0;if(!this.ctx){var b=this.dic[i];b.pause();b.currentTime=0;b.volume=d;b.loop=g;b.play();if(g){this.bgm=b}return}var j=this.dic[i];var a=this.ctx.createBufferSource();var c=this.ctx.createGain();var e=this.ctx.createStereoPanner();if(g){this.stop();a.loopEnd=j.duration-0.05;a.loop=true;this.bgm=c}c.gain.value=d;c.connect(this.ctx.destination);e.pan.value=h;e.connect(c);a.buffer=j;a.connect(e);a.start(0)};AudioMixer.prototype.fade=function(){if(this.bgm==null){return}if(!this.ctx){var b=this.bgm;var d=b.volume;var e=function(){if(Math.floor(d*100)==0){return}d*=0.95;b.volume=d;setTimeout(e,1000)};e();return}var a=this;var c=this.bgm.gain;var d=c.value;var e=function(){if(Math.floor(d*100)==0){return}d*=0.9;c.value=d;setTimeout(e,1000)};e()};AudioMixer.prototype.stop=function(){if(this.bgm==null){return}if(!this.ctx){this.bgm.pause();this.bgm=null;return}this.bgm.disconnect();this.bgm=null};function Bullet(b,a,c){Actor.apply(this,arguments);this.speed=4;this.width=8;this.height=8;this.recalculation()}Bullet.prototype=Object.create(Actor.prototype);Bullet.prototype.draw=function(a){if(this.isHitWall){this.fate();return}a.save();a.beginPath();a.fillStyle="rgba(120, 200, 255, 0.7)";a.arc(this.x,this.y,this.width/3,0,Math.PI*2,false);a.fill();a.restore()};function Enemy(){Actor.apply(this,arguments);this.routine=null;this.routineIx=0;this.routineCnt=0;this.triggerCycle=0;this.constraint=false}Enemy.prototype=Object.create(Actor.prototype);Enemy.TRIGGER_CYCLE=30;Enemy.TRIGGER_ALLOWANCE=100;Enemy.MAX_TYPE=127;Enemy.LIST=[];Enemy.assign=function(c,a,d){var b=Object.assign({},Enemy.LIST[c%Enemy.LIST.length]);b.x=a;b.y=d;return b};Enemy.prototype.trigger=function(){if(this.triggerCycle++<Enemy.TRIGGER_CYCLE){return false}this.triggerCycle=0;return true};Enemy.prototype.fire=function(e){var b=new Bullet(this.field,this.x,this.y);var f=this.calcDistance(e);var d=f/b.speed*this.field.landform.speed;var c=e.x-this.x+d;var a=e.y-this.y;b.dir=Math.atan2(a,c);return[b]};Enemy.prototype.actor_move=Actor.prototype.move;Enemy.prototype.move=function(c){var a=this;if(this.routine){var b=this.routine[this.routineIx];b.tick(this,c)}this.actor_move(c);if(this.trigger()&&Enemy.TRIGGER_ALLOWANCE<this.calcDistance(c)){if(this.constraint){return[]}return this.fire(c)}return[]};function Chain(b,a,c){Enemy.apply(this,arguments);this.prev=null;this.next=null}Chain.prototype=Object.create(Enemy.prototype);Chain.prototype.unshift=function(a){a.next=this;a.prev=this.prev;if(this.prev){this.prev.next=a}this.prev=a;return this};Chain.prototype.push=function(a){a.prev=this;a.next=this.next;if(this.next){this.next.prev=a}this.next=a;return this};Chain.prototype.remove=function(){this.prev.next=this.next;this.next.prev=this.prev;return this.next};function Field(){this.width=Field.WIDTH;this.height=Field.HEIGHT;this.hW=this.width/2;this.hH=this.height/2;this.ship=new Ship(this,-100,100);this.ship.isGone=true;this.shipTarget=null;this.shipRemain=0;this.actorList=[];this.score=0;this.hiscore=0;this.enemyCycle=0;this.stage=Stage.LIST[0];this.stageNum=0;this.setup()}Field.WIDTH=512;Field.HEIGHT=224;Field.HALF_WIDTH=Field.WIDTH/2;Field.HALF_HEIGHT=Field.HEIGHT/2;Field.MAX_ENEMIES=100;Field.ENEMY_CYCLE=10;Field.MIN_LOOSING_RATE=1;Field.MAX_LOOSING_RATE=200;Field.MAX_SHIP=3;Field.MAX_HIBERNATE=Actor.MAX_EXPLOSION*5;Field.PHASE={NORMAL:0,BOSS:1};Field.prototype.setup=function(){var a=document.getElementById("canvas");a.width=this.width;a.height=this.height;this.ctx=a.getContext("2d");this.landform=new Landform(a)};Field.prototype.nextStage=function(){var a=Stage.LIST[this.stageNum];this.stage=a;this.landform.loadStage(a);this.stageNum++;if(Stage.LIST.length<=this.stageNum){this.stageNum=0}this.stage.playBgm()};Field.prototype.reset=function(){this.phase=Field.PHASE.NORMAL;this.landform.reset();this.ship.x=100;this.ship.y=100;this.ship.trigger=false;this.ship.shotList=[];this.ship.enter();this.actorList=[this.ship];this.hibernate=Field.MAX_HIBERNATE;this.stage.playBgm()};Field.prototype.startGame=function(){var a=document.getElementById("gameOver");a.classList.add("hidden");this.loosingRate=Field.MAX_LOOSING_RATE;this.score=0;this.shipRemain=Field.MAX_SHIP;this.stageNum=0;this.nextStage();this.reset()};Field.prototype.endGame=function(){var a=document.getElementById("gameOver");a.classList.remove("hidden")};Field.prototype.isGameOver=function(){var a=document.getElementById("gameOver");return !a.classList.contains("hidden")};Field.prototype.inkey=function(a){this.ship.dir=null;if(this.isGameOver()){if(a[" "]){this.startGame()}return}if(!this.ship.explosion){if(a.Control||a.Shift){this.ship.trigger=true}this.ship.aim(this.shipTarget);this.ship.inkey(a)}};Field.prototype.moveShipTo=function(a){if(this.isGameOver()||this.ship.explosion){return}if(a){this.ship.trigger=true}this.shipTarget=a};Field.prototype.scroll=function(){var c=this;if(this.phase==Field.PHASE.BOSS){return}this.landform.scanEnemy().forEach(function(e){var d;if(e.formation){d=new EnmFormation(c,e.x,e.y).setup(e.type,8)}else{d=new e.type(c,e.x,e.y)}c.actorList.push(d)});var a=this.landform.forward(this.ship);if(this.isGameOver()){return}if(a==Landform.NEXT.NOTICE){AudioMixer.INSTANCE.fade()}else{if(a==Landform.NEXT.ARRIV&&this.stage.boss){this.phase=Field.PHASE.BOSS;AudioMixer.INSTANCE.play(this.stage.boss,0.7,true)}else{if(a==Landform.NEXT.PAST){this.nextStage()}}}if(Field.MIN_LOOSING_RATE<this.loosingRate){var b=this.loosingRate/10000;this.loosingRate-=b}};Field.prototype.draw=function(){var e=this;var a=this.ctx;var d=this.ship;var c=[];var b=[];var f=0;a.clearRect(0,0,this.width,this.height);this.landform.drawBg(a);this.actorList.forEach(function(g){if(g.isGone){return}g.constraint=parseInt(Math.random()*e.loosingRate/10)!=0;var h=g.move(d);if(h instanceof Array){h.forEach(function(i){b.push(i)})}e.landform.effect(g);e.landform.hitTest(g);g.draw(a);b.push(g);if(g instanceof Bullet){d.isHit(g)}else{if(g instanceof Enemy){d.isHit(g);c.push(g)}}if(g.explosion&&g.score){f+=g.score;g.score=0}});this.ship.shotList.forEach(function(g){c.forEach(function(h){h.isHit(g)})});if(this.phase==Field.PHASE.BOSS&&c.length==0){this.phase=Field.PHASE.NORMAL;AudioMixer.INSTANCE.fade()}this.actorList=b;this.landform.draw();this.score+=f;this.showScore();if(!this.isGameOver()&&d.isGone){AudioMixer.INSTANCE.stop();if(0<--this.hibernate){return}if(0<--this.shipRemain){this.reset()}else{this.endGame()}}};Field.prototype.showScore=function(){if(this.hiscore<this.score){this.hiscore=this.score}var a=document.querySelector("#score > div > div:nth-child(2)");var d=document.querySelector("#score > div:nth-child(2) > div:nth-child(2)");var c=document.querySelector("#score > div:nth-child(3)");var b=document.querySelector("#remain > div > div:nth-child(1)");a.innerHTML=this.score;d.innerHTML=this.hiscore;if(this.shipRemain){b.style.width=(this.shipRemain-1)*16+"px"}};function Landform(a){var b=this;this.canvas=a;this.ctx=a.getContext("2d");this.viewY=0;this.scroll=Stage.SCROLL.OFF;this.effectH=0;this.effectV=0;this.next=Landform.NEXT.NONE;this.col=0;this.colDir=1;this.magni=1;this.target=null;this.tx=0;this.ty=0;this.selection=0;this.which=null;this.brick=null;this.brickVal=null;this.lastScan=null;this.touch=false;this.img=new Image();this.img.onload=function(){b.width=this.width;b.height=this.height;b.bw=this.width/Landform.BRICK_WIDTH;b.bh=this.height/Landform.BRICK_WIDTH;b.viewX=this.width-Field.HALF_WIDTH;b.viewY=this.height-Field.HEIGHT;b.arrivX=this.width-Field.WIDTH;b.noticeX=b.arrivX-Field.HALF_WIDTH};this.reverse=new Image();this.reverse.src="./img/reverse.png";this.isEdit=false;this.touch=false}Landform.BRICK_WIDTH=8;Landform.BRICK_HALF=Landform.BRICK_WIDTH/2;Landform.COL_MAX=512;Landform.NEXT={NONE:0,NOTICE:1,ARRIV:2,PAST:3};Landform.prototype.load=function(a){if(a instanceof File){this.img.src=window.URL.createObjectURL(a)}else{this.img.src=a}};Landform.prototype.loadMapData=function(b){var c=this;var a=new Image();a.onload=function(){var e=document.createElement("canvas");var d=e.getContext("2d");e.width=this.width;e.height=this.height;d.drawImage(a,0,0);c.brick=d.getImageData(0,0,this.width,this.height);c.touch=true};if(b instanceof File){a.src=window.URL.createObjectURL(b)}else{a.src=b}};Landform.prototype.loadStage=function(b){var c=this;var a=b.getFg();this.stage=b;this.loadMapData("./img/"+b.map);this.load(a.img.src);this.reset()};Landform.prototype.reset=function(){if(this.stage){this.stage.reset(this.ctx)}};Landform.prototype.effect=function(b){var a=Math.max(b.field.width+b.width,b.maxX);if(b.effectH){b.x-=this.effectH}if(b.effectV){b.y+=this.stage.effectV}if(b.x<b.minX||a<b.x){b.eject()}if(this.stage.scroll==Stage.SCROLL.OFF){if(b.y<b.minY||b.maxY<b.y){b.eject()}return}if(this.stage.scroll==Stage.SCROLL.ON){if(b.y<-this.height||this.height+b.maxY<b.y){b.eject()}return}if(b.y<0){b.y+=this.height}else{if(this.height<b.y){b.y-=this.height}}};Landform.prototype.forward=function(b){if(!this.width){return Landform.NEXT.NONE}var a=this.stage.getFg();this.stage.scrollV(b);if(this.viewX<=a.x){this.effectH=0;if(this.next!=Landform.NEXT.PAST){this.next=Landform.NEXT.PAST;return Landform.NEXT.PAST}return Landform.NEXT.NONE}this.stage.forward();this.effectH=a.effectH;if(this.arrivX<=a.x){if(this.next!=Landform.NEXT.ARRIV){a.x=this.width-Field.WIDTH;this.effectH=0;this.next=Landform.NEXT.ARRIV;return Landform.NEXT.ARRIV}}else{if(this.noticeX<=a.x){if(this.next!=Landform.NEXT.NOTICE){this.next=Landform.NEXT.NOTICE;return Landform.NEXT.NOTICE}}}return Landform.NEXT.NONE};Landform.prototype.scanEnemy=function(){var j=[];if(!this.brick||this.width-Field.WIDTH<=i){return j}var a=this.stage.getFg();var i=a.x;var h=a.y;var d=Math.round((i+Field.WIDTH-Landform.BRICK_HALF)/Landform.BRICK_WIDTH);if(d<0){return j}if(d===this.lastScan){return j}this.lastScan=d;var g=Field.WIDTH+Landform.BRICK_WIDTH;for(var c=0;c<this.bh;c++){var b=c*this.bw*4+d*4;var e=this.brick.data[b+1];if(0<e&&e<=Enemy.MAX_TYPE){var f=-h+(c+1)*Landform.BRICK_WIDTH;j.push(Enemy.assign(e-1,g,f))}}d=Math.round(i/Landform.BRICK_WIDTH);if(d<0){return j}for(var c=0;c<this.bh;c++){var b=c*this.bw*4+d*4;var e=this.brick.data[b+1];if(Enemy.MAX_TYPE<e){var f=-h+(c+1)*Landform.BRICK_WIDTH;j.push(Enemy.assign(e-1-Enemy.MAX_TYPE,0,f))}}return j};Landform.prototype.hitTest=function(a){if(!this.brick){return}a.isHitWall=this.getBrick(a,2);this.target=a};Landform.prototype.scanFloor=function(c){if(!this.brick){return}var d=c.y;var b=this.getBrick(c,2);if(0<b){d=Math.floor(c.y/Landform.BRICK_WIDTH)*Landform.BRICK_WIDTH;while(0<b){d-=Landform.BRICK_WIDTH;var a={x:c.x,y:d};b=this.getBrick(a,2)}d+=Landform.BRICK_WIDTH}else{d=Math.floor(c.y/Landform.BRICK_WIDTH)*Landform.BRICK_WIDTH;while(d<this.height&&!b){d+=Landform.BRICK_WIDTH;var a={x:c.x,y:d};b=this.getBrick(a,2)}if(!b){d=this.height+c.height+Landform.BRICK_WIDTH}}return d};Landform.prototype.getHorizontalAngle=function(e){var d={x:e.x-Landform.BRICK_WIDTH,y:e.y-Landform.BRICK_WIDTH*2};var c={x:e.x+Landform.BRICK_WIDTH,y:e.y-Landform.BRICK_WIDTH*2};var b=this.scanFloor(d);var a=this.scanFloor(c);return Math.atan2(a-b,e.width)};Landform.prototype.getBrickIndex=function(f){var c=this.stage.getFg();var e=c.x;var d=c.y;var b=Math.round((e+f.x-Landform.BRICK_HALF)/Landform.BRICK_WIDTH);if(b<0||this.bw<b){return -1}var a=Math.round((d+f.y-Landform.BRICK_HALF)/Landform.BRICK_WIDTH);a%=this.bh;return a*this.bw*4+b*4};Landform.prototype.getBrick=function(b,d){if(!this.brick){return null}var a=this.getBrickIndex(b);if(a<0){return null}return this.brick.data[a+d]};Landform.prototype.wheel=function(b){var a=this.stage.getFg();if(b<0){a.y+=Landform.BRICK_WIDTH;if(this.height<=a.y){a.y=0}}else{if(a.y==0){a.y=this.height}a.y-=Landform.BRICK_WIDTH}};Landform.prototype.putBrick=function(b,e,d){var a=this.getBrickIndex(b);if(a<0){return}this.brick.data[a+e]=d;this.brick.data[a+3]=d?255:0};Landform.prototype.drawEnemy=function(e,h,g){var f=Enemy.MAX_TYPE<e;var b=f?e-Enemy.MAX_TYPE:e;var d=Enemy.LIST[b-1];var a=d.formation?3:1;var c=d.instance;var i=this.ctx;if(!d.instance){return null}c.x=h+c.hW;c.y=g+c.hH;while(a--){c.draw(i);c.x+=2;c.y+=2}if(f){i.save();i.translate(c.x,c.y);i.drawImage(this.reverse,-8,-4);i.restore()}return c};Landform.prototype.drawTarget=function(){if(!this.isEdit||!this.target){return}var a=this.stage.getFg();var h=a.x;var g=a.y;var d=Math.round((h+this.target.x-Landform.BRICK_HALF)/Landform.BRICK_WIDTH)*Landform.BRICK_WIDTH;var c=Math.round((g+this.target.y-Landform.BRICK_HALF)/Landform.BRICK_WIDTH)*Landform.BRICK_WIDTH;var i=this.ctx;var e=Landform.BRICK_WIDTH;var f=parseInt(this.selection);if(0<f){var b=this.drawEnemy(f,d,c);if(b){e=b.width}}i.save();i.fillStyle="rgba(128, 255, 255, .4)";i.fillRect(d,c,e,e);i.restore();this.touchDown(d,c)};Landform.prototype.touchDown=function(b,a){if(!this.which){this.tx=-1;this.ty=-1;this.brickVal=null;return}if(this.tx==b&&this.ty==a){return}var e=parseInt(this.selection);if(0<e){var d=this.getBrick(this.target,1);var c=d-Enemy.MAX_TYPE;if(!d||(d!=e&&c!=e)){this.putBrick(this.target,1,e)}else{if(d==e){this.putBrick(this.target,1,e+Enemy.MAX_TYPE)}else{this.putBrick(this.target,1,0)}}}else{var d=this.getBrick(this.target,2);if(this.brickVal==null){this.brickVal=0<d?0:255}this.putBrick(this.target,2,this.brickVal)}this.touch=true;this.tx=b;this.ty=a};Landform.prototype.drawBrick=function(){if(!this.brick||!this.isEdit){return}var m=this.stage.getFg();var l=m.x;var k=m.y;var q=this.ctx;var g=255<this.col?this.col-256:0;var j=255<this.col?255:this.col%256;var t=Landform.BRICK_WIDTH-2;var o=Math.round(l/Landform.BRICK_WIDTH)*Landform.BRICK_WIDTH;var s=o/Landform.BRICK_WIDTH;var a=Math.min(s+512/Landform.BRICK_WIDTH,this.bw);var n=Math.round(k/Landform.BRICK_WIDTH)*Landform.BRICK_WIDTH;var r=n/Landform.BRICK_WIDTH;var d=this.brick.data;q.save();q.translate(-l,-k);q.fillStyle="rgba("+g+", "+j+", 255, .4)";for(var h=0;h<this.bh;h++){var b=r+h;var e=b*Landform.BRICK_WIDTH;var c=((b%this.bh)*this.bw+s)*4;for(var i=s,f=o;i<a;i++,f+=Landform.BRICK_WIDTH,c+=4){if(i<0){continue}var p=d[c+1];if(p){this.drawEnemy(p,f,e)}if(d[c+2]==255){q.fillRect(f,e,t,t)}}}if(this.width-Field.WIDTH<=l){var i=this.width-Landform.BRICK_WIDTH;q.fillStyle="rgba(255, 0, 0, .4)";q.fillRect(i,0,Landform.BRICK_WIDTH,this.height)}q.restore();this.col+=this.colDir*16;if(this.col<=0||Landform.COL_MAX<=this.col){this.colDir*=-1}};Landform.prototype.drawBg=function(a){if(!this.stage){return}a.save();a.scale(this.magni,this.magni);this.stage.drawBg(a);a.restore()};Landform.prototype.draw=function(){if(!this.img.src||!this.img.complete){return}var b=this;var a=this.ctx;a.save();a.scale(this.magni,this.magni);this.stage.drawFg(a);this.drawBrick();this.drawTarget();a.restore();if(!this.brick||!this.isEdit){return}if(this.touch&&this.brick){this.updateMap();this.touch=false}};Landform.prototype.updateMap=function(){var c=document.getElementById("mapImage");if(c){var b=document.createElement("canvas");var a=b.getContext("2d");b.width=this.brick.width;b.height=this.brick.height;a.putImageData(this.brick,0,0);c.setAttribute("src",b.toDataURL("image/png"))}};Landform.prototype.getImageData=function(){var b=document.createElement("canvas");var a=b.getContext("2d");b.width=this.width;b.height=this.height;a.drawImage(this.img,0,0);return a.getImageData(0,0,this.width,this.height)};Landform.prototype.getBrickData=function(a){if(this.brick!=null){return this.brick}var c=this.width/Landform.BRICK_WIDTH;var b=this.height/Landform.BRICK_WIDTH;return a.createImageData(c,b)};Landform.prototype.generateBrick=function(n){if(!this.img.src||!this.img.complete){return}var f=this.getImageData();var k=this.width/Landform.BRICK_WIDTH;var e=this.height/Landform.BRICK_WIDTH;var g=this.getBrickData(n);var i=g.data;var m=0;var d=0;console.log(this.width+" x "+this.height+" | "+(this.width*this.height*4));console.log(k+" x "+e+" | "+i.length);for(var j=0;j<e;j++){for(var l=0;l<k;l++){var a=false;for(var h=0;h<4;h++){if(f.data[m+h]){a=true}}var b=a?255:0;i[d+2]=b;i[d+3]=b;m+=Landform.BRICK_WIDTH*4;d+=4}m+=this.width*(Landform.BRICK_WIDTH-1)*4}console.log("ix:"+d);console.log("sx:"+m);this.brick=g;this.touch=true};Math.PI2=Math.PI2||Math.PI*2;Math.SQ=Math.SQ||Math.PI/2;Math.trim=Math.trim||function(b){var a=b;while(Math.PI<a){a-=Math.PI2}while(a<-Math.PI){a+=Math.PI2}return a};Math.close=Math.close||function(d,c,b){var a=Math.trim(d-c);if(Math.abs(a)<=b){return d}if(0<a){return d-b}return d+b};function Missile(b,a,c){Actor.apply(this,arguments);this.dir=Math.PI/10;this.speed=6;this.width=8;this.height=8;this.recalculation()}Missile.prototype=Object.create(Actor.prototype);Missile.prototype.draw=function(a){a.save();a.beginPath();a.fillStyle="rgba(200, 200, 255, 0.6)";a.arc(this.x,this.y,this.width/3,0,Math.PI*2,false);a.fill();a.restore()};function Gizmo(b,a){this.type=b;this.destination=a}Gizmo.TYPE={FIXED:0,OWN:1,AIM:2,CHASE:3};Gizmo.DEST={TO:0,TO_X:1,TO_Y:2,ROTATE:3,ROTATE_L:4,ROTATE_R:5};Gizmo.prototype.tick=function(g,e){var d=g.field.landform;if(this.type==Gizmo.TYPE.FIXED){return}if(this.type==Gizmo.TYPE.OWN){if(this.destination==Gizmo.DEST.ROTATE_L){g.dir-=g.step}else{if(this.destination==Gizmo.DEST.ROTATE_R){g.dir+=g.step}}return}var b=e.x-g.x;var a=e.y-g.y;if(Math.abs(b)<=g.speed){b=0}if(Math.abs(a)<=g.speed){a=0}if(this.type==Gizmo.TYPE.AIM){if(this.destination==Gizmo.DEST.TO_X){if(b<0){g.radian=Math.PI}else{g.radian=0}}else{if(this.destination==Gizmo.DEST.TO_Y){if(b<0){g.radian=Math.SQ}else{g.radian=-Math.SQ}}else{if(this.destination==Gizmo.DEST.ROTATE){var f=g.calcDistance(e);if(g.speed<f){g.radian=Math.atan2(a,b)}}}}return}if(this.type==Gizmo.TYPE.CHASE){if(this.destination==Gizmo.DEST.TO){g.dir=Math.atan2(a,b)}else{if(this.destination==Gizmo.DEST.TO_X&&b){g.dir=Math.atan2(0,b)}else{if(this.destination==Gizmo.DEST.TO_Y&&a){g.dir=Math.atan2(a,0)}else{if(this.destination==Gizmo.DEST.ROTATE){var c=Math.PI/60;g.dir=Math.close(g.dir,Math.atan2(a,b),c);g.radian=g.dir}}}}}};function Movement(a){var b=parseInt(a);this.cond=a;this.count=b==a?b:null;this.list=[]}Movement.COND={X:"x",Y:"y"};Movement.prototype.add=function(a,b){this.list.push(new Gizmo(a,b));return this};Movement.prototype.isValid=function(d,c){if(!this.cond){return}if(this.count){if(d.routineCnt++<this.count){return true}d.routineCnt=0;return false}var b=c.x-d.x;var a=c.y-d.y;if(this.cond==Movement.COND.X&&Math.abs(b)<=d.speed){return false}if(this.cond==Movement.COND.Y&&Math.abs(a)<=d.speed){return false}return true};Movement.prototype.tick=function(b,a){this.list.forEach(function(c){c.tick(b,a)});if(!this.isValid(b,a)){b.routineIx++;if(b.routine.length<=b.routineIx){b.routineIx=0}}};function Ship(b,a,c){Actor.apply(this,arguments);this.speed=4;this.effectH=false;this.shotList=[];this.trigger=false;this.anim=new Animator(this,"ship001.png",Animator.TYPE.V,1,Ship.PATTERNS*2+1)}Ship.MAX_SHOTS=7;Ship.PATTERNS=2;Ship.prototype=Object.create(Actor.prototype);Ship.prototype._recalculation=Actor.prototype.recalculation;Ship.prototype.recalculation=function(){this.right=this.field.width-this.width*3;this.bottom=this.field.height-this.hH;this._recalculation()};Ship.prototype.inkey=function(b){var c=false;var a=0;if(b.ArrowLeft||b.Left){a=1;c=true}else{if(b.ArrowRight||b.Right){a=-1;c=true}}if(b.ArrowUp||b.Up){a=2-a*0.5;c=true}else{if(b.ArrowDown||b.Down){a*=0.5;c=true}}if(c){this.dir=(a+1)*Math.SQ}};Ship.prototype.sieveShots=function(){var a=[];this.shotList.forEach(function(b){if(b.isGone){return}a.push(b)});this.shotList=a};Ship.prototype._move=Actor.prototype.move;Ship.prototype.move=function(){this._move();if(this.isGone){return}if(this.isHitWall){this.fate();return}if(this.x<this.hW||this.right<this.x){this.x=this.svX}if(this.y<this.hH||this.bottom<this.y){this.y=this.svY}this.sieveShots();if(this.trigger){var a=[];this.trigger=false;if(this.shotList.length<Ship.MAX_SHOTS){var b=new Shot(this.field,this.x+this.hW,this.y);this.shotList.push(b);a.push(b)}return a}};function Shot(){Actor.apply(this,arguments);this.dir=0;this.width=16;this.height=8;this.recalculation();this.speed=12;this.effectH=false;this.size=2;this.maxX=this.field.width;var a=(this.x-Field.HALF_WIDTH)/Field.HALF_WIDTH;AudioMixer.INSTANCE.play("sfx-fire",0.4,false,a)}Shot.prototype=Object.create(Actor.prototype);Shot.prototype.fate=function(){this.x=this.field.width+this.width;this.isGone=true};Shot.prototype.draw=function(a){a.beginPath();a.fillStyle="rgba(255, 255, 0, 0.7)";a.arc(this.x,this.y,this.size,0,Math.PI*2,false);a.fill();if(this.isHitWall){this.fate()}};function Stage(a,d,b){var c=this;this.scroll=a;this.map=d;this.view=b;this.fg=null;this.bgm=null;this.boss=null;b.forEach(function(e){e.stage=c});this.effectH=0;this.effectV=0}Stage.SCROLL={OFF:0,ON:1,LOOP:2};Stage.LIST=[];Stage.prototype.setBgm=function(b){var a=arguments.length;this.bgm=b;this.boss=1<a?arguments[1]:null;return this};Stage.prototype.playBgm=function(){if(this.bgm){AudioMixer.INSTANCE.play(this.bgm,0.7,true)}};Stage.prototype.getFg=function(){if(this.fg){return this.fg}var a;this.view.forEach(function(b){if(b instanceof StageFg){a=b}});this.fg=a;return a};Stage.prototype.reset=function(a){this.effectH=0;this.effectV=0;this.view.forEach(function(b){if(!b.pattern){b.pattern=a.createPattern(b.img,"repeat")}b.reset()})};Stage.prototype.scrollV=function(f){this.effectV=0;if(this.scroll==Stage.SCROLL.OFF){return}var e=f.field;var d=e.hH-f.y;var b=this.getFg();if(Math.abs(d)<b.speed){return}var a=d/3;if(this.scroll==Stage.SCROLL.ON){var c=b.y-a;if(c<0||b.viewY<c){return}}this.effectV=a};Stage.prototype.forward=function(a){this.view.forEach(function(b){b.forward(a)})};Stage.prototype.drawBg=function(a){this.view.forEach(function(b){if(b instanceof StageFg){return}b.draw(a)})};Stage.prototype.drawFg=function(a){this.view.forEach(function(b){if(b instanceof StageBg){return}b.draw(a)})};function StageView(b){var c=this;var a=arguments.length;this.ready=false;this.pattern=null;this.img=new Image();this.img.src="./img/"+b;this.img.onload=function(){c.width=this.width;c.height=this.height;c.w2=this.width*2;c.h2=this.height*2;c.viewX=this.width-Field.HALF_WIDTH;c.viewY=this.height-Field.HEIGHT;c.ready=true};this.speed=1<a?arguments[1]:1;this.dir=2<a?arguments[2]:0;this.blink=3<a?arguments[3]:0;this.reset()}StageView.prototype.reset=function(){this.x=0;this.y=0;this.effectH=0;this.effectV=0;this.alpha=1;this.blinkDir=-1};StageView.prototype.forward=function(){var a=this.stage.effectV;this.effectH=Math.cos(this.dir)*this.speed;this.effectV=Math.sin(this.dir)*this.speed;this.x+=this.effectH;this.y+=this.effectV;this.y-=a*this.speed;if(this.width<this.x){this.x-=this.width}if(this.y<0){this.y+=this.height}if(this.height<this.y){this.y-=this.height}if(this.blink){this.alpha+=this.blinkDir*this.blink;if(this.alpha<=0.3||1<=this.alpha){this.blinkDir*=-1}}};StageView.prototype.draw=function(a){a.save();a.globalAlpha=this.alpha;a.translate(-this.x,-this.y);a.beginPath();a.fillStyle=this.pattern;a.rect(0,0,this.w2,this.h2);a.fill();a.restore()};function StageFg(){StageView.apply(this,arguments)}StageFg.prototype=Object.create(StageView.prototype);StageFg.prototype._reset=StageView.prototype.reset;StageFg.prototype.reset=function(){this._reset();this.x=-Field.WIDTH};function StageBg(){StageView.apply(this,arguments)}StageBg.prototype=Object.create(StageView.prototype);