<?php print '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en-US">
	<head>
		<meta name="dtb:uid" content="<?php print $metadata['identifier'][0]['identifier']; ?>"/>
		<meta name="dtb:depth" content="1"/>
		<meta name="dtb:totalPageCount" content="0"/>
		<meta name="dtb:maxPageNumber" content="0"/>
	</head>
	<docTitle>
		<text><?php print $metadata['title']; ?></text>
	</docTitle>
	<docAuthor>
		<text><?php print $metadata['creator'][0]; ?></text>
	</docAuthor>
	<?php print $navMap; ?>
</ncx>
