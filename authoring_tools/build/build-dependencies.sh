#!/usr/bin/env bash

function usage() {
    echo "Usage: build-dependencies <DRUPAL_PATH>"
    echo ""
}

if [ ! $1 ] || [ ! -d $1 ]; 
then
    usage
    exit
fi

if [ ! -f $1/index.php ];
then
    echo "Error: This doesn't look like a Drupal install (no index.php)"
    echo
    usage
    exit
fi

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
curl -s -L -o polymaps.tgz https://github.com/simplegeo/polymaps/tarball/v2.5.0
tar -xz -C src -f polymaps.tgz
rm polymaps.tgz
rm ./src/simplegeo-polymaps-13ae25d/polymaps.min.js
echo "Patching polymaps..."
cp ./src/simplegeo-polymaps-13ae25d/polymaps.js ./src/simplegeo-polymaps-13ae25d/polymaps.js.prepatch
patch ./src/simplegeo-polymaps-13ae25d/polymaps.js polymaps.js.patch
echo "Moving to Drupal libraries..."
if [ ! -d $1/sites/all/libraries ];
then
    mkdir -p $1/sites/all/libraries/polymaps
fi
mv ./src/simplegeo-polymaps-13ae25d $1/sites/all/libraries/polymaps
echo
