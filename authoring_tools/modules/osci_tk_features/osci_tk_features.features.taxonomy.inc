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
  );
}
