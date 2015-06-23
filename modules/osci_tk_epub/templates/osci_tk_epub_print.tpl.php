<html>
	<head>
		<?php foreach($css_urls as $url): ?>
			<link rel='stylesheet' href='<?php echo $url; ?>' />
		<?php endforeach; ?>
	</head>
	<body>
		<div class='publication-metadata'>
			<h1><?php print $publication->title; ?></h1>
			<h2><?php print $publicationsection->title; ?></h2>
			<?php if (isset($publication->field_osci_tk_cover_image['und'])): ?>
				<img src='<?php print file_create_url($publication->field_osci_tk_cover_image['und'][0]['uri']); ?>' />
			<?php endif; ?>
			<?php if (isset($publication->field_osci_tk_creator['und'])): ?>
				<p class='creator'>
					<?php
						$creators = array();
						foreach($publication->field_osci_tk_creator['und'] as $creator) {
							$creators[] = $creator['value'];
						}
						echo join(', ', $creators)
					?>
				</p>
			<?php endif; ?>
			<?php if (isset($publication->field_osci_tk_publisher['und'])): ?>
				<p class='publisher'>
					Published by: <?php echo $publication->field_osci_tk_publisher['und'][0]['value']; ?>
				</p>
			<?php endif; ?>
			<?php if (isset($publication->field_osci_tk_rights['und'])): ?>
				<p class='rights'>
					<?php echo $publication->field_osci_tk_rights['und'][0]['value']; ?>
				</p>
			<?php endif; ?>

			<?php if (isset($publication->field_osci_tk_description['und'])): ?>
				<p class='description'>
					<?php echo $publication->field_osci_tk_description['und'][0]['value']; ?>
				</p>
			<?php endif; ?>
		</div>
		<div class='section-separator'>&nbsp;</div>
		<?php echo $content; ?>
	</body>'
</html>