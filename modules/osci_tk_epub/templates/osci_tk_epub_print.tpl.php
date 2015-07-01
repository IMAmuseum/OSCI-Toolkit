<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<link rel="shortcut icon" href="/sites/default/files/favicon.ico" type="image/vnd.microsoft.icon" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="description" content="Welcome to the Art Institute’s online scholarly catalogues. James Ensor: The Temptation of Saint Anthony is an exhibition catalogue which features essays by Susan M. Canning, Patrick Florizoone and Nancy Ireson, Anna Swinbourne, Debora Silverman, and Kimberly J. Nichols. Monet Paintings and Drawings at the Art Institute of Chicago and Renoir Paintings and Drawings at the Art Institute of Chicago are permanent collection catalogues with essays by Gloria Groom, Jill Shaw, John Collins, Nancy Ireson, Kelly Keegan, Kimberley Muir, and Dawn Jaros. Additional research support was provided by Genevieve Westerby and Inge Fiedler. Peer review was conducted by Paul Tucker Hayes and Colin Bailey.  Each digital catalogue contains in-depth curatorial and conservation research on the museum’s collection, including high-resolution, zoomable images, and other interactive elements about the artwork. Upcoming catalogues scheduled for release in 2015 will be devoted to the museum’s holdings of works by Gustave Caillebotte, Camille Pissarro, and Paul Gauguin, as well as our collection of Roman art.">
	<?php if (isset($publicationsection->title)): ?>
      <title><?php print $publicationsection->title; ?></title>
    <?php else: ?>
      <title><?php print $publication->title; ?></title>
    <?php endif; ?>
	<?php foreach($css_urls as $url): ?>
	  <link rel='stylesheet' href='<?php echo $url; ?>' />
	<?php endforeach; ?>
</head>
	<body>
		<div class='publication-metadata'>
			<h1><?php print $publication->title; ?></h1>
            <?php if (isset($publicationsection->title)): ?>
            <h2><?php print $publicationsection->title; ?></h2>
            <?php endif; ?>
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
	</body>
</html>