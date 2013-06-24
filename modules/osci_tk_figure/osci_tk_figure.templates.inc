<?php 

function osci_tk_figure_preprocess_osci_tk_figure_formatter(&$vars) {
    global $osci_tk_placed_figures;
    $addFigInfo = $osci_tk_placed_figures;
    $itemDelta = $vars['item']['delta'];
    $vars['item']['delta'] = isset($addFigInfo[$itemDelta]) ? $addFigInfo[$itemDelta]['delta'] : $itemDelta;
    $vars['item']['count'] = isset($addFigInfo[$itemDelta]) ? $addFigInfo[$itemDelta]['count'] : 1;

	drupal_add_css(drupal_get_path('module', 'osci_tk_figure') . '/css/figure_field.css');

	$thumbnail = module_invoke_all('osci_tk_figure_thumbnail', array('item' => $vars['item']));
  	$vars['item']['thumbnail'] = array_pop($thumbnail);	

	$content = module_invoke_all('osci_tk_figure_content', array('item' => $vars['item']));
	$vars['figure_content'] = implode('', $content);

    // allow over modules/types to alter final figure
    drupal_alter('osci_tk_figure_formatter', $vars);
}
