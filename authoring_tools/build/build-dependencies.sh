#!/usr/bin/env bash

function usage() {
    echo "Usage: build-dependencies /path/to/drupal"
    echo ""
}

# test for arguments
if [ ! $1 ] || [ ! -d $1 ]; 
then
    usage
    exit
fi

# test for index.php - to ensure a drupal directory
if [ ! -f $1/index.php ];
then
    echo "Error: This doesn't look like a Drupal install (no index.php)"
    echo
    usage
    exit
fi

# test for trailing slash - should not be present
dpath=$(echo $1 | awk '{print substr($0,length,1)}')
if [ $dpath = '/' ];
then
    echo "Error: No trailing slash '/' on path please"
    echo
    usage
    exit
fi

# if no src dir, create one
if [ ! -d ./src ];
then
    mkdir ./src
fi

echo

#
# Polymaps
#
echo "Downloading and extracting polymaps..."
curl -s -k -L -o polymaps-2.5.0.tgz https://github.com/simplegeo/polymaps/tarball/v2.5.0
tar -xz -C src -f polymaps-2.5.0.tgz
rm polymaps-2.5.0.tgz
rm ./src/simplegeo-polymaps-13ae25d/polymaps.min.js
cp ./src/simplegeo-polymaps-13ae25d/polymaps.js ./src/simplegeo-polymaps-13ae25d/polymaps.js.prepatch
patch ./src/simplegeo-polymaps-13ae25d/polymaps.js polymaps.js.patch
echo "Moving to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/polymaps ];
then
    mkdir -p $1/sites/all/libraries/polymaps
fi
rm -rf $1/sites/all/libraries/polymaps/*
mv -f ./src/simplegeo-polymaps-13ae25d/* $1/sites/all/libraries/polymaps
rm -rf ./src/simplegeo-polymaps-13ae25d
echo

#
# JsColor
#
echo "Downloading and extracting jscolor..."
curl -s -L -O http://jscolor.com/release/jscolor-1.3.9.zip
unzip -o -q jscolor-1.3.9.zip -d src
rm jscolor-1.3.9.zip
echo "Moving to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/jscolor ];
then
    mkdir -p $1/sites/all/libraries/jscolor
fi
rm -rf $1/sites/all/libraries/jscolor/*
mv -f ./src/jscolor/* $1/sites/all/libraries/jscolor
rm -rf ./src/jscolor
echo

#
# Amplify.js
#
echo "Downloading and extracting amplify..."
curl -s -L -o amplify-1.1.0.tgz https://github.com/appendto/amplify/tarball/1.1.0
tar -xz -C src -f amplify-1.1.0.tgz
rm amplify-1.1.0.tgz
echo "Moving to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/amplify ];
then
    mkdir -p $1/sites/all/libraries/amplify
fi
rm -rf $1/sites/all/libraries/amplify/*
mv -f ./src/appendto-amplify-bede933/* $1/sites/all/libraries/amplify
rm -rf ./src/appendto-amplify-bede933
echo
