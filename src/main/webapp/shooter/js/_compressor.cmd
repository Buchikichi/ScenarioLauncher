@echo off
set CUR=%~dp0
set YUI=d:\applications\yuicompressor-2.4.8.jar
set SSFW=ssfw\*.js
set IMPL=enemy\*.js boss\*.js material\*.js implementor.js

cd %CUR%
type %SSFW% > ssfw-min.js
type %IMPL% > implementor-min.js
java -jar %YUI% -o ssfw-min.js ssfw-min.js
java -jar %YUI% -o implementor-min.js implementor-min.js
pause
