<?php

function osci_tk_epub_preprocess_osci_tk_figure_formatter_epub(&$vars) {

    $asset = node_load($vars['item']['asset_reference']);

    // TODO: Figure out a way to do this without hard-coding
    switch($asset->type) {
      case 'image_asset':
        $vars['media_type'] = 'image/jpeg'; break;
      case 'svg_asset':
        $vars['media_type'] = 'image/svg+xml'; break;
      case 'iip_asset':
        $vars['media_type'] = 'application/osci-tk-iip-figure'; break;
      case 'conservation_asset':
        $vars['media_type'] = 'application/osci-tk-conservation-figure'; break;      
      default:
        $vars['media_type'] = 'application/xhtml+xml';
    }
    
}


?>
