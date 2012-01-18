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
echo "Copying to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/polymaps ];
then
    mkdir -p $1/sites/all/libraries/polymaps
fi
rm -rf $1/sites/all/libraries/polymaps/*
cp -r ./src/simplegeo-polymaps-13ae25d/* $1/sites/all/libraries/polymaps
echo

#
# JsColor
#
echo "Downloading and extracting jscolor..."
curl -s -L -O http://jscolor.com/release/jscolor-1.3.9.zip
unzip -o -q jscolor-1.3.9.zip -d src
rm jscolor-1.3.9.zip
echo "Copying to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/jscolor ];
then
    mkdir -p $1/sites/all/libraries/jscolor
fi
rm -rf $1/sites/all/libraries/jscolor/*
cp -r ./src/jscolor/* $1/sites/all/libraries/jscolor
echo

#
# Amplify.js
#
echo "Downloading and extracting amplify..."
curl -s -k -L -o amplify-1.1.0.tgz https://github.com/appendto/amplify/tarball/1.1.0
tar -xz -C src -f amplify-1.1.0.tgz
rm amplify-1.1.0.tgz
echo "Copying to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/amplify ];
then
    mkdir -p $1/sites/all/libraries/amplify
fi
rm -rf $1/sites/all/libraries/amplify/*
cp -r ./src/appendto-amplify-bede933/* $1/sites/all/libraries/amplify
echo

#
# DOMPDF
#
echo "Downloading and extracting DOMPDF..."
curl -s -L -O http://dompdf.googlecode.com/files/dompdf-0.5.2.zip
unzip -o -q dompdf-0.5.2.zip -d src
rm dompdf-0.5.2.zip
echo "Copying to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/dompdf ];
then
    mkdir -p $1/sites/all/libraries/dompdf
fi
rm -rf $1/sites/all/libraries/dompdf/*
cp -r ./src/dompdf/* $1/sites/all/libraries/dompdf
chmod 1777 $1/sites/all/libraries/dompdf/lib/fonts
echo

#
# Simple HTML DOM
#
echo "Downloading and extracting Simple HTML DOM..."
curl -s -L -O http://iweb.dl.sourceforge.net/project/simplehtmldom/simplehtmldom/1.11/simplehtmldom_1_11.zip
unzip -o -q simplehtmldom_1_11.zip -d src
rm simplehtmldom_1_11.zip
echo "Copying to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/simplehtmldom ];
then
    mkdir -p $1/sites/all/libraries/simplehtmldom
fi
rm -rf $1/sites/all/libraries/simplehtmldom/*
cp -r ./src/simplehtmldom/* $1/sites/all/libraries/simplehtmldom
echo

echo "Finished"