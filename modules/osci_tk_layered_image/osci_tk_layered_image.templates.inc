<?php
/**
 * @file
 * osci_tk_layered_image.template.inc
 */

function osci_tk_layered_image_preprocess_osci_tk_layered_image_figure_formatter(&$vars) {

    // dpm($vars);

    if (isset($vars['node'])) {
        $asset = $vars['node'];
    } else {
        $asset = node_load($vars['item']['asset_reference']);
    }

    switch($asset->type) {
      case 'image_asset':
      case 'iip_asset':
      case 'layered_image':
        $vars['media_type'] = 'application/osci-tk-layered_image-figure';
        break;
      default:
        $vars['media_type'] = 'application/xhtml+xml';
    }
}
