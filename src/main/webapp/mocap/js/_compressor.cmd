@echo off
set CUR=%~dp0
set YUI=d:\applications\yuicompressor-2.4.8.jar
set MOCAP=MathExtension.js Matrix.js Skeleton.js Field.js index.js

cd %CUR%
type %MOCAP% > mocap-min.js
java -jar %YUI% -o mocap-min.js mocap-min.js
pause
