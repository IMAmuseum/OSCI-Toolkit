<figure id="<?php print $item['fig_id']; ?>" title="<?php print $item['number_template']?>" data-position="<?php print $item['position']; ?>" data-columns="<?php print $item['columns']; ?>" data-figure_type="<?php print $item['type']; ?>" data-aspect="<?php print $item['aspect']; ?>" data-options="<?php print htmlspecialchars($item['options']); ?>" data-order="<?php print $item['delta']; ?>" data-count="<?php print $item['count']; ?>">
	<?php
		if (isset($item['thumbnail'])) {
			print $item['thumbnail'];
		}
		elseif (isset($thumbnail)) {
			print $thumbnail;
		}
	?>
	<div class='figure_content'><?php print $figure_content ?></div>
	<figcaption><div><?php if (strlen($item['number_template'])) { ?><span class="figure_number"><?php print $item['number_template']; ?></span> <?php } print check_markup($item['value'], $item['format']); ?></div></figcaption>
</figure>
