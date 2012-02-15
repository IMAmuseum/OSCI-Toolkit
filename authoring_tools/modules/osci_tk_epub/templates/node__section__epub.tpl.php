<?php echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"; ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head></head>
<body>
	<div id="<?php print "section-".$nid; ?>">
		<div class="body">
			<?php print $content['field_body'][0]['#markup']; ?>
		</div>
		<div class="footnotes">
			<?php foreach(element_children($content['field_footnotes']) as $index => $footnote): ?>
				<div class="footnote">
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</body>
</html>