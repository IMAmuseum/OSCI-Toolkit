<aside id="footnotes">
	<?php for($i = 0; $i < count($items); $i++):?>
		<aside epub:type='footnote' id="n<?= $i?>">
		  <?= $items[$i]['value']; ?>
		</aside>
	<?php endfor; ?>	
</aside>