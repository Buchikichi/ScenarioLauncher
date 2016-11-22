#!/bin/sh
export CUR=`dirname ${0}`
export YUI=~/Documents/app/yuicompressor-2.4.8.jar
export SSFW=ssfw/*.js
export IMPL="enemy/*.js boss/*.js material/*.js implementor.js"

cd $CUR
cat $SSFW > ssfw-min.js
cat $IMPL > implementor-min.js
java -jar $YUI -o ssfw-min.js ssfw-min.js
java -jar $YUI -o implementor-min.js implementor-min.js
