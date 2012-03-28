<section <?php print count($classes_array) ? 'class="' . implode(' ', $classes_array) . '"' : ''; ?>>
	<?php if(!$label_hidden): ?>
		<span class="label"><?php print $label; ?>:</span>
	<?php ENDIF; ?>
	<?php print render($items); ?>
</section>