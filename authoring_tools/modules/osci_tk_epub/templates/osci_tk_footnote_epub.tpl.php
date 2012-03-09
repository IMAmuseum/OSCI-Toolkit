<section epub:type='footnotes' id="footnotes">
	<?php for($i = 0; $i < count($items); $i++):?>
		<aside epub:type='footnote' id="<?= $items[$i]['fn_id']; ?>">
		  <?= $items[$i]['value']; ?>
		</aside>
	<?php endfor; ?>	
</section>