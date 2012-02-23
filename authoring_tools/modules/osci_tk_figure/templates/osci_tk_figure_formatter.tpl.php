<figure id="<?php print $item['fig_id']; ?>" data-position="<?php print $item['position']; ?>" data-columns="<?php print $item['columns']; ?>" data-options="<?php print htmlspecialchars($item['options']); ?>">
	<?= $figure_content ?>
	<figcaption><?php print $item['number_template'] . ' ' . $item['caption']; ?></figcaption>
</figure>