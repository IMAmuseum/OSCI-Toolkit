<?php
/**
 * osci_tk_figure.template.inc
 */

function osci_tk_figure_preprocess_osci_tk_figure_formatter(&$vars) {
	global $osci_tk_placed_figures;
	$addFigInfo = $osci_tk_placed_figures;
	$itemDelta = $vars['item']['delta'];
	$vars['item']['delta'] = isset($addFigInfo[$itemDelta]) ? $addFigInfo[$itemDelta]['delta'] : $itemDelta;
	$vars['item']['count'] = isset($addFigInfo[$itemDelta]) ? $addFigInfo[$itemDelta]['count'] : 1;
	$export = isset($vars['item']['export']) ? true : false;

	drupal_add_css(drupal_get_path('module', 'osci_tk_figure') . '/css/figure_field.css');

	if (isset($vars['item']['custom_thumbnail']) && (int)$vars['item']['custom_thumbnail'] > 0) {
		$file = file_load($vars['item']['custom_thumbnail']);
		$vars['item']['thumbnail'] = _osci_tk_epub_asset_process_uri($file->uri, $export);
	}

	if (!isset($vars['item']['thumbnail'])) {
		if($export) {
			$asset_node = node_load($vars['item']['asset_reference']);
			$vars['item']['thumbnail'] = _osci_tk_epub_asset_process_uri($asset_node->field_image['und'][0]['uri'], $export);
		} else {
			$thumbnail = module_invoke_all('osci_tk_figure_thumbnail', array('item' => $vars['item']));
			$vars['item']['thumbnail'] = array_pop($thumbnail);
		}
	}

	$content = module_invoke_all('osci_tk_figure_content', array('item' => $vars['item']));
	$vars['figure_content'] = implode('', $content);

	// allow over modules/types to alter final figure
	drupal_alter('osci_tk_figure_formatter', $vars);
}
