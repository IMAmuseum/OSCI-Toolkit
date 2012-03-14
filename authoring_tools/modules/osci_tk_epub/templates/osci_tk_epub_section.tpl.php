<?php 
	$exploded = explode('_', $item['field_name']);
	$field_name = array_pop($exploded);
?>
<section id="<?php print $field_name . '-' . $item['delta']; ?>" class="<?php print $classes.' '.$field_name; ?>">
	<?php print $item['value']; ?>
</section>