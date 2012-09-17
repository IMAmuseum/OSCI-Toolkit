<?php 


function osci_tk_conservation_iip_admin_form($form, &$form_state) {
	// form the text area default value
	$hosts = variable_get('osci_tk_conservation_iip_hosts', array());
	$hosts_field = '';
	foreach ($hosts as $host) {
		$hosts_field = $hosts_field . $host['name'] . '|' . $host['url'] . "\n";
	}
	$form = array();
	
	$form['osci_tk_conservation_iip_hosts'] = array(
			'#type'				=> 'textarea',
			'#title'			=> 'IIP Hosts',
			'#description'		=> 'A keyed list of IIP servers. One per line, in name|url format',
			'#default_value'	=> $hosts_field
	);
	
	$form['#submit'][] = 'osci_tk_conservation_iip_admin_form_submit';
	
	return system_settings_form($form);
}

function osci_tk_conservation_iip_admin_form_submit($form, &$form_state) {
	$value_text = $form_state['values']['osci_tk_conservation_iip_hosts'];
	// break apart the lines
	$value_lines = explode("\n", $value_text);
	$values = array();
	foreach ($value_lines as $line) {
		$split = explode('|', $line);
		if ($split[0] && $split[1]) {
			$val_arr = array();
			$val_arr['name'] = trim($split[0]);
			$val_arr['url'] = trim($split[1]);
			$values[] = $val_arr;
		}
		
	}
	$form_state['values']['osci_tk_conservation_iip_hosts'] = $values;
}