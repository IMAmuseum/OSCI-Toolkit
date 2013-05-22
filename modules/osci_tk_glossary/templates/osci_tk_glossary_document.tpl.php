<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head></head>
    <body>
        <dl>
        <?php foreach ($terms as $name => $term): ?>
        	<dt data-tid="<?php print $term['term_id']; ?>"><dfn><?php print $name; ?></dfn></dt>
        	<dd><?php print $term['definition']; ?></dd>
        <?php endforeach; ?>
        </dl>
    </body>
</html>