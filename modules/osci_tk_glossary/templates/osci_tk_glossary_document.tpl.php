<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head></head>
    <body>
        <dl>
        <?php foreach ($terms as $k => $term): ?>
        	<dt data-tid="<?php print $term['term_id']; ?>"><dfn><?php print $term['name']; ?></dfn></dt>
        	<dd><?php print $term['definition']; ?></dd>
        <?php endforeach; ?>
        </dl>
    </body>
</html>