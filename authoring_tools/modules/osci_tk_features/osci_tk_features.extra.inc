<?php 

// using menu alter in the event the actual 
// features module someday provides its own menu
function osci_tk_features_menu_alter(&$items) {
	$items['admin/config/system/osci'] = array(
	        'title'             => t('OSCI ToolKit Settings'),
	        'description'		=> 'Provides settings for the OSCI ToolKit',
	        'page callback'     => 'drupal_get_form',
	        'page arguments'    => array('osci_tk_features_admin_form'),
	        'access arguments'  => array('administer OSCI ToolKit settings'),
	        'type'				=> MENU_NORMAL_ITEM
	);
	
	$items['admin/config/system/osci/overview'] = array(
		        'title'             => t('Overview'),
		        'type'				=> MENU_DEFAULT_LOCAL_TASK,
		        'weight'			=> -1
	);
	
	$items['admin/config/system/osci/images'] = array(
		        'title'             => t('Images'),
		        'description'		=> 'Settings for image sizes',
		        'page callback'     => 'drupal_get_form',
		        'page arguments'    => array('osci_tk_features_images_admin_form'),
		        'access arguments'  => array('administer OSCI ToolKit settings'),
		        'type'				=> MENU_LOCAL_TASK,
	);
}

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
	// array containing a pretty title and a variable name to store the mapped image style
	// returned array should look like:
	// array('Title' => 'variable name')
	// ex: array('Conservation Thumbnail' => 'osci_tk_image_style_conservation_thumbnail')
	$types = module_invoke_all('osci_tk_image_types');
	$styles = image_style_options(FALSE);
	
	foreach ($types as $title => $type) {
		$form[$type] = array(
			'#type'				=> 'select',
			'#title'			=> $title,
			'#options'			=> $styles,
			'#default_value'	=> variable_get($type, 'osci_tk_default')
		);
	}

	return system_settings_form($form);
}