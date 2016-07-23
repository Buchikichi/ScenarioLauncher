@echo off
set CUR=%~dp0
set YUI=d:\applications\yuicompressor-2.4.8.jar
set SRC= Bullet.js Enemy.js Chain.js Enm*.js material\*.js

cd %CUR%
type %SRC% > Enemy-min.js
java -jar %YUI% -o Enemy-min.js Enemy-min.js
pause
