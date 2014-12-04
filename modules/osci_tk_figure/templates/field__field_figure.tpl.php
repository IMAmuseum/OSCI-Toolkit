<section id="figures">
	<?php 
		global $osci_tk_placed_figures;
		$numItems = count($osci_tk_placed_figures);
		foreach($items as $item)
		{
			if ($numItems > 0) {
				if (array_key_exists($item['#item']['delta'], $osci_tk_placed_figures)) {
					$item['#item']['number_template'] = $osci_tk_placed_figures[$item['#item']['delta']]['fig_text'];
				} elseif ($item['#item']['position'] === 'plate') {
					$item['#item']['number_template'] = "";
				} elseif ($item['#item']['position'] === 'platefull') {
					$item['#item']['number_template'] = "";
				} else {
					continue;
				}
			}
				
			print drupal_render($item); 
		}
	?>
</section>