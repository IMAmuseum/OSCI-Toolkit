<?php 

/**
 * @file 
 * provides admin settings for OSCI Toolkit features
 */

function osci_tk_features_admin_form($form, &$form_state) {
	$form = array();
	$form['text'] = array(
		'#markup' => '<p>TODO: Enter an overview and brief help for the other setting tabs here</p>'
	);
	return $form;
}

function osci_tk_features_images_admin_form($form, &$form_state) {
	$form = array();
	// allow modules to provide an array of needed image styles by returning an
	// array containing a pretty title, a variable name to store the mapped image style,
	// and a description of the 
	// returned array should look like:
	// array(array('title' => 'Very Pretty', 'variable' => 'osci_tk_image_style_thumbnail', 'description' => 'test'))
	$types = module_invoke_all('osci_tk_image_types');
	$styles = image_style_options(FALSE);
	foreach ($types as $type) {
		$form[$type['variable']] = array(
			'#type'				=> 'select',
			'#title'			=> t($type['title']),
			'#description'		=> t($type['description']),
			'#options'			=> $styles,
			'#default_value'	=> variable_get($type['variable'], 'osci_tk_default')
		);
	}
	return system_settings_form($form);
}
