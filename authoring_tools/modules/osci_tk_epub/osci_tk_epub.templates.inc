<?php

function osci_tk_epub_preprocess_epub_package(&$vars)
{
	$metaThemed = array();
	foreach($vars['metadata'] as $k => $v)
	{
		switch($k)
		{
			case 'identifier':
				$metaThemed[] = '<dc:identifier id="publication-id">' . $v . '</dc:identifier>';
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