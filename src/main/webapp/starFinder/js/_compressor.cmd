@echo off
set CUR=%~dp0
set COMP=d:\applications\closure-compiler-v20170521.jar
set COMP_OPT=--compilation_level SIMPLE --warning_level DEFAULT --language_out=ES5
set IMPL=MathExtension.js Field.js Ripple.js Star.js index.js

cd %CUR%
type %IMPL% > index-all.js
java -jar %COMP% %COMP_OPT% --js index-all.js --js_output_file index-min.js
del index-all.js
pause
