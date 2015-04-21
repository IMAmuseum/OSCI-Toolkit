<?php
/**
 * @file
 * osci_tk_features.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function osci_tk_features_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_image_default_styles().
 */
function osci_tk_features_image_default_styles() {
  $styles = array();

  // Exported image style: osci_tk_default.
  $styles['osci_tk_default'] = array(
    'effects' => array(
      1 => array(
        'name' => 'image_scale',
        'data' => array(
          'width' => 50,
          'height' => '',
          'upscale' => 1,
        ),
        'weight' => 1,
      ),
    ),
    'label' => 'osci_tk_default',
  );

  // Exported image style: osci_tk_thumbnail_square.
  $styles['osci_tk_thumbnail_square'] = array(
    'effects' => array(
      1 => array(
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => 200,
          'height' => 150,
        ),
        'weight' => 1,
      ),
    ),
    'label' => 'osci_tk_thumbnail_square',
  );

  return $styles;
}

/**
 * Implements hook_node_info().
 */
function osci_tk_features_node_info() {
  $items = array(
    'html_asset' => array(
      'name' => t('HTML Asset'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'iip_asset' => array(
      'name' => t('IIP Asset'),
      'base' => 'node_content',
      'description' => t('An IIP based image used in a publication'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'image_asset' => array(
      'name' => t('Image Asset'),
      'base' => 'node_content',
      'description' => t('An Image used as a figure in a publication'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'layered_image' => array(
      'name' => t('Layered Image'),
      'base' => 'node_content',
      'description' => t('An interactive figure type that combines assets into layers'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'note' => array(
      'name' => t('Note'),
      'base' => 'node_content',
      'description' => t('User Notes'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'publication' => array(
      'name' => t('Publication'),
      'base' => 'node_content',
      'description' => t('The root of a publication. Used to store publication information and the publication content heirarchy'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'section' => array(
      'name' => t('Section'),
      'base' => 'node_content',
      'description' => t('A section of content for a publication'),
      'has_title' => '1',
      'title_label' => t('Administrative Title'),
      'help' => '',
    ),
    'svg_asset' => array(
      'name' => t('SVG Asset'),
      'base' => 'node_content',
      'description' => t('A Scalable Vector Graphic for use in a layered image'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
