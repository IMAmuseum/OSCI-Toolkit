<?php
/**
 * @file
 * osci_tk_epub.template.inc
 */

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

    // Handle title and subtitle of a section
    switch ($vars['field_name']) {
        case 'title':
            $vars['content'] = '<h1>' . check_plain($vars['item']['value']) . '</h1>';
            break;
        case 'subtitle':
            $vars['content'] = '<h3>' . check_plain($vars['item']['value']) . '</h3>';
            break;
        default:
            $vars['content'] = check_markup($vars['item']['value'], $vars['item']['format']);
            break;
    }

}

function theme_osci_tk_epub_navigation_generate_toc_item_list(&$vars) {
    $depth = -1;
    $flag = false;
    $output = '';
    foreach ($vars['toc'] as $leaf) {
        while ($leaf['depth'] > $depth) {
            $output .= '<ol><li>';
            $flag = false;
            $depth++;
        }    
        while ($leaf['depth'] < $depth) {
            $output .= '</li></ol>';
            $depth--;
        }    
        if ($flag) {
            $output .= '</li><li>';
            $flag = false;
        }    

        $link = $vars['for_export'] ? $leaf['filename'] : $leaf['url'];

        $attrs = "data-section_id=\"{$leaf['nid']}\"";
        $attrs .= " data-subtitle=\"{$leaf['subtitle']}\"";
        $attrs .= " data-timestamp=\"{$leaf['timestamp']}\"";
        $attrs .= " data-thumbnail=\"{$leaf['thumbnail']}\"";
        $output .= "<a href=\"{$link}\" {$attrs}>{$leaf['title']}</a>";

        $flag = true;
    }    
    while ($depth-- > -1) {
        $output .= '</li></ol>';
    }    
    return $output;
}

function theme_osci_tk_epub_navigation_generate_index(&$vars) {
    $list = '';
    $output = '';
    if (isset($vars['node']->field_nodetree['und']) && is_array($vars['node']->field_nodetree['und'])) {
        foreach ($vars['node']->field_nodetree['und'] as $nodeTreeItem) {
            $target = $nodeTreeItem['target_nid'];
            $section = node_load($target, _osci_tk_utility_retrieve_revision_id_by_timestamp($target, $vars['rev_time']));
            $link = $vars['for_export'] ? _osci_tk_epub_node_content_filename($section->nid) : _osci_tk_epub_node_content_url($section->nid, $vars['rev_time'], $vars['node']->nid);

            $title = $section->title;
            if (isset($section->field_osci_tk_title) && isset($section->field_osci_tk_title['und'][0]['value'])) {
                $title = $section->field_osci_tk_title['und'][0]['value'];
            }    

            $list .= "<li><a href='{$link}'>{$title}</a></li>";

            // if section has figures, include them in index
            if (isset($section->field_figure['und']) && count($section->field_figure['und']) > 0) { 
                for ($i=0; $i < count($section->field_figure['und']); $i++) {
                    $link = $vars['for_export'] ? _osci_tk_epub_node_figure_filename($section->nid, $i) : _osci_tk_epub_node_figure_url($section->nid, $i, $vars['rev_time'], $vars['node']->nid);
                    $list .= "<li><a href='{$link}'>{$title}: Fig. {$i}</a></li>";
                }    
            }    
        }    
    }    

    $output = "<nav epub:type='index' id='book-{$vars['node']->nid}-index'>";
    $output .= "<h1>Index</h1>"; // Optional header
    $output .= "<ol>{$list}</ol>"; // The only other element allowed as a child of <nav>
    $output .= "</nav>";
    return $output;
}

function theme_osci_tk_epub_ncx_generate_navmap(&$vars) {
    $output = null;
    if (!is_null($vars['data']['content_nids'])) {
        // Not using templates for performance. Might consider an XML library.
        $output = "<navMap>";
        $count = 0; 
        foreach($vars['data']['content_nids'] as $content) {
            $count++;
            $url = $vars['for_export'] ? $content['filename'] : $content['url'];
            $output .= '<navPoint id="section-' . $content['nid'] . '" playOrder="' . $count . '"><navLabel><text>' . $content['title'] . '</text></navLabel><content src="' . $url . '" /></navPoint>';
        }    

        $output .= "</navMap>";
    }    

    return $output;
}
