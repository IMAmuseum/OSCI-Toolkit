<dl>
<?php foreach ($terms as $name => $term): ?>
	<td data-tid="<?php print $term['term_id']; ?>"><dfn><?php print $name; ?></dfn></td>
	<dd><?php print $term['definition']; ?></dd>
<?php endforeach; ?>
</dl>