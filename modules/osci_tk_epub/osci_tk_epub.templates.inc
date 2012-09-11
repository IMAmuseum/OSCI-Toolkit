<?php

function osci_tk_epub_preprocess_epub_package(&$vars)
{
	$metaThemed = array();
	foreach($vars['metadata'] as $k => $v)
	{
		switch($k)
		{
			case 'identifier':
				$first = true;
				foreach($v as $identifier) {
					if ($first) {
						$elementId = "publication-id";
					} else {
						$elementId = "publication-id-" . $identifier['identifier_type'];
					}
					$identifierString = '<dc:identifier id="' . $elementId . '">urn:' . $identifier['identifier_type'] . ':' . $identifier['identifier'] . '</dc:identifier>';

					switch ($identifier['identifier_type']) {
						case 'doi':
							$identifierString .= '<meta refines="#' . $elementId . '" property="identifier-type" scheme="onix:codelist5">06</meta>';
							break;
						case 'isbn':
							$identifierString .= '<meta refines="#' . $elementId . '" property="identifier-type" scheme="onix:codelist5">15</meta>';
							break;
					}

					$metaThemed[] = $identifierString;
					$first = false;
				}
				
				break;
			case 'meta':
				foreach ($v as $prop => $value)
				{
					$metaThemed[] = '<meta property="' . $prop . '">' . $value . '</meta>';
				}
				break;
			case 'title':
				$metaThemed[] = '<dc:title id="t1">' . $v . '</dc:title><meta refines="#t1" property="title-type">main</meta><meta refines="#t1" property="display-seq">1</meta>';
				break;
			default:
				if (is_array($v))
				{
					foreach($v as $value)
					{
						$metaThemed[] = '<dc:' . $k . '>' . $value . '</dc:' . $k . '>';
					}
				} else {
					$metaThemed[] = '<dc:' . $k . '>' . $v . '</dc:' . $k . '>';
				}
		}
	}
	
	$vars['metadata'] = $metaThemed;
}

function osci_tk_epub_preprocess_osci_tk_epub_section(&$vars)
{
	$exploded = explode('_', $vars['item']['field_name']);
	$vars['field_name'] = array_pop($exploded);

	$vars['content'] = check_markup($vars['item']['value'], $vars['item']['format']);
}