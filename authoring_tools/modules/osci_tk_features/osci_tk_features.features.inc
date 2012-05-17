<?php
/**
 * @file
 * osci_tk_features.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function osci_tk_features_ctools_plugin_api() {
  list($module, $api) = func_get_args();
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_image_default_styles().
 */
function osci_tk_features_image_default_styles() {
  $styles = array();

  // Exported image style: osci_tk_default
  $styles['osci_tk_default'] = array(
    'name' => 'osci_tk_default',
    'effects' => array(
      1 => array(
        'label' => 'Scale',
        'help' => 'Scaling will maintain the aspect-ratio of the original image. If only a single dimension is specified, the other dimension will be calculated.',
        'effect callback' => 'image_scale_effect',
        'dimensions callback' => 'image_scale_dimensions',
        'form callback' => 'image_scale_form',
        'summary theme' => 'image_scale_summary',
        'module' => 'image',
        'name' => 'image_scale',
        'data' => array(
          'width' => '50',
          'height' => '',
          'upscale' => 1,
        ),
        'weight' => '1',
      ),
    ),
  );

  // Exported image style: osci_tk_thumbnail_square
  $styles['osci_tk_thumbnail_square'] = array(
    'name' => 'osci_tk_thumbnail_square',
    'effects' => array(
      4 => array(
        'label' => 'Scale and crop',
        'help' => 'Scale and crop will maintain the aspect-ratio of the original image, then crop the larger dimension. This is most useful for creating perfectly square thumbnails without stretching the image.',
        'effect callback' => 'image_scale_and_crop_effect',
        'dimensions callback' => 'image_resize_dimensions',
        'form callback' => 'image_resize_form',
        'summary theme' => 'image_resize_summary',
        'module' => 'image',
        'name' => 'image_scale_and_crop',
        'data' => array(
          'width' => '50',
          'height' => '50',
        ),
        'weight' => '1',
      ),
    ),
  );

  return $styles;
}

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
    'file_asset' => array(
      'name' => t('File Asset'),
      'base' => 'node_content',
      'description' => '',
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
    'note' => array(
      'name' => t('Note'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'publication' => array(
      'name' => t('Publication'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'section' => array(
      'name' => t('Section'),
      'base' => 'node_content',
      'description' => t('A section of a book'),
      'has_title' => '1',
      'title_label' => t('Administrative Title'),
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
