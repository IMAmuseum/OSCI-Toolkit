<?php
/**
 * @file
 * osci_tk_features.features.taxonomy.inc
 */

/**
 * Implements hook_taxonomy_default_vocabularies().
 */
function osci_tk_features_taxonomy_default_vocabularies() {
  return array(
    'note_tags' => array(
      'name' => 'Note Tags',
      'machine_name' => 'note_tags',
      'description' => 'freetagging on notes',
      'hierarchy' => '1',
      'module' => 'taxonomy',
      'weight' => '0',
    ),
    'tags' => array(
      'name' => 'Tags',
      'machine_name' => 'tags',
      'description' => 'Use tags to group articles on similar topics into categories.',
      'hierarchy' => '0',
      'module' => 'taxonomy',
      'weight' => '0',
    ),
  );
}
