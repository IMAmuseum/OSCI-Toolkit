<package version='3.0' unique-identifier="publication-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="publication-id"><?= $pub_id ?></dc:identifier>
    <dc:title><?= $title ?></dc:title>
    <dc:language><?= $language ?></dc:language>
    <?php foreach ($properties as $key => $value): ?>
      <meta property="<?= $key ?>"><?= $value ?></meta>
    <?php endforeach ?>
  </metadata>
  <manifest>
    <?php foreach ($manifest as $item): ?>
      <?php $properties = isset($item['properties']) ? "properties='{$item['properties']}'" : ''; ?>      
	  <item id="<?=$item['id']?>" href="<?=$item['href']?>" 
	        media-type="<?=$item['media-type']?>" <?=properties?> />
    <?php endforeach ?>
  </manifest>
  <spine>
    <?php foreach ($spine as $itemref): ?>
      <itemref idref='<?=$itemref['idref']?>'/>
    <?php endforeach ?>
  </spine>
</package>