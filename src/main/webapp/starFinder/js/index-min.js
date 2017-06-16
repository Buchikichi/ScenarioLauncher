var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,d){a!=Array.prototype&&a!=Object.prototype&&(a[b]=d.value)};$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.polyfill=function(a,b,d,c){if(b){d=$jscomp.global;a=a.split(".");for(c=0;c<a.length-1;c++){var e=a[c];e in d||(d[e]={});d=d[e]}a=a[a.length-1];c=d[a];b=b(c);b!=c&&null!=b&&$jscomp.defineProperty(d,a,{configurable:!0,writable:!0,value:b})}};$jscomp.polyfill("Array.prototype.fill",function(a){return a?a:function(a,d,c){var b=this.length||0;0>d&&(d=Math.max(0,b+d));if(null==c||c>b)c=b;c=Number(c);0>c&&(c=Math.max(0,b+c));for(d=Number(d||0);d<c;d++)this[d]=a;return this}},"es6-impl","es3");
Math.PI2=Math.PI2||2*Math.PI;Math.SQ=Math.SQ||Math.PI/2;Math.trim=Math.trim||function(a){for(;Math.PI<a;)a-=Math.PI2;for(;a<-Math.PI;)a+=Math.PI2;return a};Math.close=Math.close||function(a,b,d){b=Math.trim(a-b);return Math.abs(b)<=d?a:0<b?a-d:a+d};function Field(){this.stars=[];this.starMap={};this.maxMag=0;this.constellations=[];this.showConstellation=!1;this.rotationV=this.rotationH=this.dx=0;this.seekTarget=null;this.magnification=1;this.init()}Field.MIN_RAD=Math.PI/900;
Field.prototype.init=function(){$("#view");this.ctx=document.getElementById("canvas").getContext("2d");this.loadStars();this.loadConstellation();this.ripple=new Ripple(this)};Field.prototype.resetCanvas=function(a){this.height=this.width=a;this.hW=this.width/2;this.hH=this.height/2;$("#canvas").attr("width",this.width).attr("height",this.height);this.ctx.font="12px 'Times New Roman'";this.zoom(0)};
Field.prototype.loadStars=function(){var a=this;$.ajax("dat/hipparcos.json",{success:function(b){b.forEach(function(b){var c=new Star(a,b.ra,b.dec,b.v,b.s);a.stars.push(c);a.starMap[b.id]=c});console.log("hipparcos:"+b.length)}})};Field.prototype.loadConstellation=function(){var a=this;$.ajax("dat/constellation.json",{success:function(b){console.log("constellation.json:"+b.length);a.constellations=b}})};Field.prototype.rotateH=function(a){this.dx=a;20<Math.abs(this.dx)&&(this.dx=0>this.dx?-20:20)};
Field.prototype.rotateV=function(a){this.rotationV-=a*Math.PI/1800;this.rotationV<-Math.SQ?this.rotationV=-Math.SQ:Math.SQ<this.rotationV&&(this.rotationV=Math.SQ)};Field.prototype.zoom=function(a){this.magnification+=a/4;1>this.magnification&&(this.magnification=1);this.radius=this.width*this.magnification/2};Field.prototype.seek=function(){this.seekTarget=1==arguments.length?this.starMap[arguments[0]]:new Star(this,arguments[0],arguments[1]);this.ripple.stop()};
Field.prototype.drawConstellation=function(a,b){if(this.showConstellation){var d=this,c=this.ctx;this.constellations.forEach(function(e){var f=d.starMap[e.pos];f&&(f.move(a,b),0<f.z&&(c.fillStyle="rgba(128, 128, 128, 0.5)",c.fillText(e.name,f.x,f.y)),c.strokeStyle="rgba(32, 80, 128, 0.6)",e.list.forEach(function(e){var f=d.starMap[e.from];e=d.starMap[e.to];f.move(a,b);e.move(a,b);0<f.z&&0<e.z&&(c.beginPath(),c.moveTo(f.x,f.y),c.lineTo(e.x,e.y),c.stroke())}))})}};
Field.prototype.drawStars=function(a,b){var d=0,c=this.ctx,e=100*this.maxMag;this.stars.forEach(function(f){e<f.v||(f.move(a,b),f.draw(c),d++)});return d};
Field.prototype.draw=function(){if(this.ctx){var a=this.ctx,b=this.rotationH,d=-this.rotationV;a.clearRect(0,0,this.width,this.height);a.save();a.translate(this.hW,this.hH);this.drawConstellation(b,d);var c=this.drawStars(b,d);a.restore();a.fillStyle="white";a.fillText("stars:"+c,0,20);a.fillText("v:"+this.rotationV,0,40);0!=this.dx&&(this.rotationH+=this.dx*Math.PI/300,this.rotationH=Math.trim(this.rotationH));0<Math.abs(this.dx)&&(this.dx+=-(0>this.dx?-1:1));if(this.seekTarget){var c=this.seekTarget,
e=c.dec,f=-c.ra,g=Math.abs(Math.trim(this.rotationV-e))/8,k=Math.abs(Math.trim(this.rotationH-f))/8,h=!1;Field.MIN_RAD<=g&&(this.rotationV=Math.close(this.rotationV,e,g),h=!0);Field.MIN_RAD<=k&&(this.rotationH=Math.close(this.rotationH,f,k),h=!0);h||(c.move(b,d),this.ripple.begin(c.x,c.y),this.seekTarget=null)}this.ripple.draw(a)}};function Ripple(a){this.field=a;this.max=this.radius=0}Ripple.prototype.begin=function(a,b){this.x=a;this.y=b;this.radius=0;this.max=this.field.width/8};
Ripple.prototype.stop=function(){this.radius=Number.MAX_VALUE};Ripple.prototype.draw=function(a){this.max<this.radius||(a.save(),a.translate(this.field.hW,this.field.hH),a.beginPath(),a.strokeStyle="rgba(255, 255, 0, .4)",a.arc(this.x,this.y,this.radius,0,Math.PI2,!1),a.stroke(),a.restore(),this.radius+=10)};function Star(a,b,d,c,e){this.field=a;this.ra=b;this.dec=d;this.v=c;this.ratio=this.getRatio(c);this.color=this.getColor(e)}Star.MIN_V=-144;Star.MAX_V=1408;Star.V_WIDTH=Star.MAX_V-Star.MIN_V;
Star.prototype.getRatio=function(a){return(Star.V_WIDTH-(a-Star.MIN_V))/Star.V_WIDTH};
Star.prototype.getColor=function(a){var b=.5*this.ratio;switch(a){case "O":a="rgba(90, 160, 255, "+b+")";break;case "B":a="rgba(190, 255, 255, "+b+")";break;case "A":a="rgba(255, 255, 255, "+b+")";break;case "F":a="rgba(255, 255, 102, "+b+")";break;case "G":a="rgba(255, 255, 34, "+b+")";break;case "K":a="rgba(255, 136, 68, "+b+")";break;case "M":a="rgba(255, 80, 80, "+b+")";break;default:a="rgba(34, 34, 204, "+b+")"}return a};
Star.prototype.move=function(a,b){var d=this.field.radius;var c=this.ra+a;var e=this.dec;a=-Math.sin(e)*d;d*=Math.cos(e);e=-Math.sin(c)*d;d*=Math.cos(c);c=Math.cos(b)*a-Math.sin(b)*d;this.z=Math.sin(b)*a+Math.cos(b)*d;0>this.z||(a=c,this.x=Math.cos(0)*e-Math.sin(0)*a,this.y=Math.sin(0)*e+Math.cos(0)*a)};Star.prototype.draw=function(a){0>this.z||(a.beginPath(),a.fillStyle=this.color,a.arc(this.x,this.y,2.8*this.ratio,0,Math.PI2,!1),a.fill())};
$(document).ready(function(){var a=$("#view"),b=$("#slider"),d=$("#constellationSwitch"),c=new Field,e=0,f=0,g=0,k=function(a){if(a.type.match(/^mouse/))e=a.pageX,f=a.pageY;else if(a.originalEvent.touches){var b=a.originalEvent.touches[0];e=b.pageX;f=b.pageY}g=a.which},h=function(a){if(a.type.match(/^mouse/)){if(!g)return;var b=a.pageX;var d=a.pageY}else a.originalEvent.touches&&(d=a.originalEvent.touches[0],b=d.pageX,d=d.pageY);a=f-d;c.rotateH(e-b);c.rotateV(a);e=b;f=d},l=function(a){g=0};$(window).resize(function(){var a=
$("body"),b=$("#header"),d=$("#footer"),b=a.height()-b.outerHeight(!0)-d.outerHeight(!0)-10,a=Math.min(a.width(),b);c.resetCanvas(a)});a.mousedown(k);a.mousemove(h);a.mouseleave(l);a.mouseup(l);a.bind("touchstart",k);a.bind("touchmove",h);a.bind("touchend",l);a.mousewheel(function(a){c.zoom(a.deltaY)});b.change(function(){c.maxMag=$(this).val()});d.change(function(){c.showConstellation=$(this).is(":checked")});b.change();d.change();var m=function(){var a=window.requestAnimationFrame||window.mozRequestAnimationFrame||
window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;c.draw();a(m)};m();$(window).resize();loadNames(c)});function loadNames(a){var b=$("#searchPanel ul");$.ajax("dat/names.json",{success:function(d){console.log("names.json:"+d.length);d.forEach(function(c){var d=$("<a></a>").text(c.name),f=$("<li></li>").append(d);c.text&&f.attr("data-filtertext",c.text);b.append(f);d.click(function(){c.star?a.seek(c.star):a.seek(c.longitude,c.latitude)})});b.filterable("refresh")}})};
