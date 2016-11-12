#!/bin/sh
export CUR=`dirname ${0}`
export YUI=~/Documents/app/yuicompressor-2.4.8.jar
export MOCAP='MathExtension.js Matrix.js Anima.js Skeleton.js Field.js Repository.js AudioMixer.js index.js'

cd $CUR
cat $MOCAP > mocap-min.js
#java -jar $YUI -o mocap-min.js mocap-min.js
