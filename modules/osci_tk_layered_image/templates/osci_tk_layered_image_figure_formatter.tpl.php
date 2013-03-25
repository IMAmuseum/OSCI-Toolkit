<object id="<?php print $item['fig_id']; ?>" 
	type="<?php print $media_type ?>" 
	data="<?php print $item['content_url']; ?>">
	<div class="fallback-content">
		<?php if ($item['thumbnail']): ?>
		<img src="<?php print($item['thumbnail']); ?>" />
		<?php endif; ?>
	</div>
</object>
