<?php


function osci_tk_conservation_preprocess_osci_tk_conservation_figure_formatter(&$vars) {

    $asset = node_load($vars['item']['asset_reference']);

    switch($asset->type) {
      case 'image_asset':
        $vars['media_type'] = 'application/osci-tk-image-figure'; break;
      case 'svg_asset':
        $vars['media_type'] = 'application/osci-tk-svg-figure'; break;
      case 'iip_asset':
        $vars['media_type'] = 'application/osci-tk-iip-figure'; break;
      case 'conservation_asset':
        $vars['media_type'] = 'application/osci-tk-conservation-figure'; break;      
      default:
        $vars['media_type'] = 'application/xhtml+xml';
    }
}