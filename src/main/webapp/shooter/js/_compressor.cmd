@echo off
set CUR=%~dp0
set YUI=d:\applications\yuicompressor-2.4.8.jar
set COMP=d:\applications\closure-compiler-v20161201.jar
set COMP_OPT=--compilation_level SIMPLE --warning_level DEFAULT --language_out=ES5
set SSFW=ssfw\*.js
set IMPL=enemy\*.js boss\*.js material\*.js implementor.js

cd %CUR%
type %SSFW% > ssfw.js
type %IMPL% > implementor-all.js
:java -jar %YUI% -o ssfw-min.js ssfw-min.js
:java -jar %YUI% -o implementor-min.js implementor-min.js
java -jar %COMP% %COMP_OPT% --js ssfw.js --js_output_file ssfw-min.js
java -jar %COMP% %COMP_OPT% --js implementor-all.js --js_output_file implementor-min.js
pause
