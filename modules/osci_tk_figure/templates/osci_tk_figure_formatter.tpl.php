<figure id="<?php print $item['fig_id']; ?>" title="<?php print $item['number_template']?>" data-position="<?php print $item['position']; ?>" data-columns="<?php print $item['columns']; ?>" data-figure_type="<?php print $item['type']; ?>" data-aspect="<?php print $item['aspect']; ?>" data-options="<?php print htmlspecialchars($item['options']); ?>">
	<?php 
		if (isset($item['thumbnail'])) {
			print $item['thumbnail'];
		}
		elseif (isset($thumbnail)) {
			print $thumbnail;
		}
	?>
	<div class='figure_content'><?php print $figure_content ?></div>
	<figcaption><p><?php print $item['number_template'] . ' ' . check_markup($item['value'], $item['format']); ?></p></figcaption>
</figure>
