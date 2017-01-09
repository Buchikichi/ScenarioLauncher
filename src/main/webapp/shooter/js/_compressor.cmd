@echo off
set CUR=%~dp0
set YUI=d:\applications\yuicompressor-2.4.8.jar
set COMP=d:\applications\closure-compiler-v20161201.jar
set SSFW=ssfw\*.js
set IMPL=enemy\*.js boss\*.js material\*.js implementor.js

cd %CUR%
type %SSFW% > ssfw.js
type %IMPL% > implementor-min.js
:java -jar %YUI% -o ssfw-min.js ssfw-min.js
java -jar %COMP% --compilation_level SIMPLE_OPTIMIZATIONS --js ssfw.js --js_output_file ssfw-min.js
java -jar %YUI% -o implementor-min.js implementor-min.js
pause
