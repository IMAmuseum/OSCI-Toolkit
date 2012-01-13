<?php
/**
 * @file
 * osci_tk_features.features.inc
 */

/**
 * Implements hook_node_info().
 */
function osci_tk_features_node_info() {
  $items = array(
    'conservation_asset' => array(
      'name' => t('Conservation Asset'),
      'base' => 'node_content',
      'description' => t('A collection of other assets pulled together in a multi-layer display'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'iip_asset' => array(
      'name' => t('IIP Asset'),
      'base' => 'node_content',
      'description' => t('An IIP based image used in a Conservation Asset'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'image_asset' => array(
      'name' => t('Image Asset'),
      'base' => 'node_content',
      'description' => t('An Image used in a Conservation Asset'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'svg_asset' => array(
      'name' => t('SVG Asset'),
      'base' => 'node_content',
      'description' => t('A Scalable Vector Graphic'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  return $items;
}
