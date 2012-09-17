<section id="figures">
	<?php 
		foreach($items as $item)
		{
			print drupal_render($item); 
		}
	?>
</section>