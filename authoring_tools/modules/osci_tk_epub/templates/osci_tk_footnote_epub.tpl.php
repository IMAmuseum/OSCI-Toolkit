<section epub:type='footnotes' id="footnotes">
	<?php for($i = 0; $i < count($items); $i++):?>
		<aside epub:type='footnote' id="<?php print $items[$i]['fn_id']; ?>">
		  <?php print $items[$i]['value']; ?>
		</aside>
	<?php endfor; ?>	
</section>