<?php

/**
 * Open Search settings
 */
function osci_tk_search_opensearch($form, &$form_state) {
	$form['osci_tk_search_short_name'] = array(
		'#type'				=> 'textarea',
		'#title'			=> t('Short name'),
		'#description'		=> t('A brief name that will appear in buttons, UI controls, etc., that reference this search content provider.'),
		'#default_value'	=> variable_get('osci_tk_search_short_name', ''),
		'#required'			=> TRUE,
	);
	$form['osci_tk_search_long_name'] = array(
		'#type'				=> 'textarea',
		'#title'			=> t('Long name'),
		'#description'		=> t('The name used to refer to this search content provider in hypertext links, etc.'),
		'#default_value'	=> variable_get('osci_tk_search_long_name', ''),
		'#required'			=> TRUE,
	);
	$form['osci_tk_search_description'] = array(
		'#type'				=> 'textarea',
		'#title'			=> t('Description'),
		'#description'		=> t('A human readable text description of the search content provider.'),
		'#default_value'	=> variable_get('osci_tk_search_description', ''),
		'#required'			=> TRUE,
	);
	$form['osci_tk_search_tags'] = array(
		'#type'				=> 'textarea',
		'#title'			=> t('Tags'),
		'#description'		=> t('A space-delimited set of words that are used as keywords to identify and categorize this site search content.'),
		'#default_value'	=> variable_get('osci_tk_search_tags', ''),
		'#required'			=> TRUE,
	);
	$form['osci_tk_search_contact'] = array(
		'#type'				=> 'textarea',
		'#title'			=> t('Contact'),
		'#description'		=> t('An email address at which the developer can be reached.'),
		'#default_value'	=> variable_get('osci_tk_search_contact', ''),
		'#required'			=> TRUE,
	);
	$form['osci_tk_search_adult_content'] = array(
		'#type'				=> 'select',
		'#title'			=> t('Adult Content'),
		'#description'		=> t('Does the content of the search share adult content?'),
		'#default_value'	=> variable_get('osci_tk_search_adult_content', ''),
		'#options'			=> array(FALSE => 'No', TRUE => 'Yes'),
		'#required'			=> TRUE,
	);
	return system_settings_form($form);
}