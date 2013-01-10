<?php

function osci_tk_glossary_preprocess_osci_tk_glossary_document(&$vars) {
	$vars['terms'] = array();
	foreach ($vars['vocabularies'] as $vocab_id) {
		$tree = taxonomy_get_tree($vocab_id);
		foreach ($tree as $leaf) {
			$vars['terms'][$leaf->name] = array(
				'term_id' => $leaf->tid,
				'definition' => $leaf->description,
			);
		}
    }
}