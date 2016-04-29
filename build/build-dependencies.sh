#!/usr/bin/env bash

function usage() {
    echo "Usage: build-dependencies /path/to/drupal"
    echo ""
}

# test for arguments
if [ ! $1 ] || [ ! -d $1 ]; then
    usage
    exit
fi

# test for index.php - to ensure a drupal directory
if [ ! -f $1/index.php ]; then
    echo "Error: This doesn't look like a Drupal install (no index.php)"
    echo $1/index.php
    echo
    usage
    exit
fi

# test for trailing slash - should not be present
dpath=$(echo $1 | awk '{print substr($0,length,1)}')
if [ $dpath = '/' ]; then
    echo "Error: No trailing slash '/' on path please"
    echo
    usage
    exit
fi

# if no src dir, create one
if [ ! -d ./src ]; then
    mkdir ./src
fi

# store current directory
cpath=`pwd`

echo

#
# Polymaps
#
echo "Downloading and extracting polymaps..."
curl -s -k -L -o polymaps-2.5.0.tgz https://github.com/simplegeo/polymaps/tarball/v2.5.0
tar -xz -C src -f polymaps-2.5.0.tgz
rm polymaps-2.5.0.tgz
rm ./src/simplegeo-polymaps-13ae25d/polymaps.min.js
echo `pwd`
cp ./src/simplegeo-polymaps-13ae25d/polymaps.js ./src/simplegeo-polymaps-13ae25d/polymaps.js.prepatch
patch ./src/simplegeo-polymaps-13ae25d/polymaps.js ./polymaps.js.patch
echo "Copying to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/polymaps ]; then
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
if [ ! -d $1/sites/all/libraries/jscolor ]; then
    mkdir -p $1/sites/all/libraries/jscolor
fi
rm -rf $1/sites/all/libraries/jscolor/*
cp -r ./src/jscolor/* $1/sites/all/libraries/jscolor
echo

#
# DOMPDF
#
echo "Downloading and extracting DOMPDF..."
curl -s -L -O http://dompdf.googlecode.com/files/dompdf-0.5.2.zip
unzip -o -q dompdf-0.5.2.zip -d src
rm dompdf-0.5.2.zip
echo "Copying to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/dompdf ]; then
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
if [ ! -d $1/sites/all/libraries/simplehtmldom ]; then
    mkdir -p $1/sites/all/libraries/simplehtmldom
fi
rm -rf $1/sites/all/libraries/simplehtmldom/*
cp -r ./src/simplehtmldom/* $1/sites/all/libraries/simplehtmldom
echo

#
# FancyBox
#
echo "Downloading and extracting FancyBox..."
curl -s -L -O http://fancybox.googlecode.com/files/jquery.fancybox-1.3.4.zip
unzip -o -q jquery.fancybox-1.3.4.zip -d src
rm jquery.fancybox-1.3.4.zip
echo "Copying to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/fancybox ]; then
    mkdir -p $1/sites/all/libraries/fancybox
fi
rm -rf $1/sites/all/libraries/fancybox/*
cp -r ./src/jquery.fancybox-1.3.4/* $1/sites/all/libraries/fancybox
echo

#
# CKEditor
#
echo "Downloading and extracting CKEditor..."
curl -s -L -O http://download.cksource.com/CKEditor/CKEditor/CKEditor%203.6.6.1/ckeditor_3.6.6.1.zip
unzip -o -q ckeditor_3.6.6.1.zip -d src
rm ckeditor_3.6.6.1.zip
echo "Copying to Drupal libraries..."
if [ ! -d $1/sites/all/libraries/ckeditor ]; then
    mkdir -p $1/sites/all/libraries/ckeditor
fi
rm -rf $1/sites/all/libraries/ckeditor/*
cp -r ./src/ckeditor/* $1/sites/all/libraries/ckeditor
echo

#
# Create module symlinks
#
echo "Creating module symlinks..."
if [ ! -d $/sites/default/modules ]; then
    mkdir -p $1/sites/default/modules
fi
cd $1/sites/default/modules
ln -s ../OSCI-Toolkit/modules/* .
cd $cpath
echo

#
# Module Dependencies
#
echo "Ensuring contrib module dependencies"
if [ ! -d $1/sites/all/modules/features ]; then
    echo " - downloading Features module"
    curl -s -L -O http://ftp.drupal.org/files/projects/features-7.x-2.5.zip
    unzip -o -q features-7.x-2.5.zip -d src
    rm features-7.x-2.5.zip
    mv src/features $1/sites/all/modules/
fi
if [ ! -d $1/sites/all/modules/field_group ]; then
    echo " - downloading Field_group module"
    curl -s -L -O http://ftp.drupal.org/files/projects/field_group-7.x-1.4.zip
    unzip -o -q field_group-7.x-1.4.zip -d src
    rm field_group-7.x-1.4.zip
    mv src/field_group $1/sites/all/modules/
fi
if [ ! -d $1/sites/all/modules/libraries ]; then
    echo " - downloading Libraries module"
    curl -s -L -O http://ftp.drupal.org/files/projects/libraries-7.x-2.2.zip
    unzip -o -q libraries-7.x-2.2.zip -d src
    rm libraries-7.x-2.2.zip
    mv src/libraries $1/sites/all/modules/
fi
if [ ! -d $1/sites/all/modules/references ]; then
    echo " - downloading References module"
    curl -s -L -O http://ftp.drupal.org/files/projects/references-7.x-2.1.zip
    unzip -o -q references-7.x-2.1.zip -d src
    rm references-7.x-2.1.zip
    mv src/references $1/sites/all/modules/
fi
if [ ! -d $1/sites/all/modules/wysiwyg ]; then
    echo " - downloading WYSIWYG module"
    curl -s -L -O http://ftp.drupal.org/files/projects/wysiwyg-7.x-2.2.zip
    unzip -o -q wysiwyg-7.x-2.2.zip -d src
    rm wysiwyg-7.x-2.2.zip
    mv src/wysiwyg $1/sites/all/modules/
fi
if [ ! -d $1/sites/all/modules/ctools ]; then
    echo " - downloading CTools module"
    curl -s -L -O http://ftp.drupal.org/files/projects/ctools-7.x-1.4.zip
    unzip -o -q ctools-7.x-1.4.zip -d src
    rm ctools-7.x-1.4.zip
    mv src/ctools $1/sites/all/modules/
fi
if [ ! -d $1/sites/all/modules/apachesolr ]; then
    echo " - downloading ApacheSolr module"
    curl -s -L -O http://ftp.drupal.org/files/projects/apachesolr-7.x-1.7.zip
    unzip -o -q apachesolr-7.x-1.7.zip -d src
    rm apachesolr-7.x-1.7.zip
    mv src/apachesolr $1/sites/all/modules/
fi
echo

rm -R ./src

echo "Finished"
