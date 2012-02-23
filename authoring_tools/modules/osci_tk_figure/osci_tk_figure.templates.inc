<?php 

function osci_tk_figure_preprocess_osci_tk_figure_formatter(&$vars) {
  
  $content = module_invoke_all('osci_tk_figure_content', array('item' => $vars['item']));
  
  $vars['figure_content'] = implode('', $content);
  
}