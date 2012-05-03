<?php
/**
 * @file
 * osci_tk_features.features.filter.inc
 */

/**
 * Implements hook_filter_default_formats().
 */
function osci_tk_features_filter_default_formats() {
  $formats = array();

  // Exported format: OSCI ToolKit Default Format
  $formats['osci_tk_format'] = array(
    'format' => 'osci_tk_format',
    'name' => 'OSCI ToolKit Default Format',
    'cache' => '0',
    'status' => '1',
    'weight' => '0',
    'filters' => array(
      'osci_tk_cross_link' => array(
        'weight' => '0',
        'status' => '1',
        'settings' => array(),
      ),
      'osci_tk_figure' => array(
        'weight' => '0',
        'status' => '1',
        'settings' => array(),
      ),
    ),
  );

  return $formats;
}
