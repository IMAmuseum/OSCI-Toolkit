<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
	  xmlns:epub="http://www.idpf.org/2007/ops">
<head>
	<title><?php print $title; ?></title>
	<?php print drupal_get_css(); ?>
</head>
<body>
	<div><?php print drupal_render($content); ?></div>
</body>
</html>