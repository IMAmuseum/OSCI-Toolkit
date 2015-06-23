<?php echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"; ?>
<package version="3.0" unique-identifier="publication-id" xmlns="http://www.idpf.org/2007/opf" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
	<?php foreach ($metadata as $key => $value): ?>
		<?php print $value ?>
    <?php endforeach ?>
    <dc:language><?php print $language ?></dc:language>
  </metadata>

  <manifest>
    <?php foreach ($manifest as $item): ?>
      <?php $properties = isset($item['properties']) ? "properties='{$item['properties']}'" : ''; ?>
	  <item id="<?php print $item['id'] ?>" href="<?php print $item['href'] ?>"
	        media-type="<?php print $item['media-type'] ?>" <?php print $properties ?> ></item>
    <?php endforeach ?>
  </manifest>
  <spine toc="ncxtoc">
    <?php foreach ($spine as $itemref): ?>
      <itemref idref='<?php print $itemref['idref'] ?>'></itemref>
    <?php endforeach ?>
  </spine>
</package>
<!-- Generated Using the OSCI Toolkit on <?php print gmdate(DATE_W3C); ?> -->