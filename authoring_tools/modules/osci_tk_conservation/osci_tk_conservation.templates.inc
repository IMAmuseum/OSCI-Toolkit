<?php


function osci_tk_conservation_preprocess_osci_tk_conservation_figure_formatter(&$vars) {

    $asset = node_load($vars['item']['asset_reference']);

    switch($asset->type) {
      case 'image_asset':
        $vars['media_type'] = 'application/osci-tk-image-figure'; break;
      case 'svg_asset':
        $vars['media_type'] = 'application/osci-tk-svg-figure'; break;
      case 'iip_asset':
        $vars['media_type'] = 'application/osci-tk-iip-figure'; break;
      case 'conservation_asset':
        $vars['media_type'] = 'application/osci-tk-conservation-figure'; break;      
      default:
        $vars['media_type'] = 'application/xhtml+xml';
    }
}

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