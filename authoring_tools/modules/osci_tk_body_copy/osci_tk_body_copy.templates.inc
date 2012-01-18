<?php

function osci_tk_body_copy_preprocess_body_copy_figure(&$vars) {
    $figure = $vars['figure'];
    $node = node_load($figure['figure_reference']);
    
    if (!isset($node->nid)) {
        watchdog("osci_tk_body_copy", "invalid figure reference " . $figure['figure_reference']);
        return;
    }
    node_build_content($node);

    $vars['content'] = "";
    
    if (!isset($figure['figCount'])) {
        $figure['figCount'] = 0;
        $vars['figure']['figCount'] = 0;
    }
    
    if (!isset($figure['catalogNumber'])) {
        $vars['figure']['catalogNumber'] = 0;
    }
    
    if ($figure['id'] === "osci_tk_plate_fig")
    {
        if ($node->referencing_entity->type == "work_of_art") {
            $figure['figure_options'] = '{"interaction":true,"annotation":false}';
        } else {
            $figure['figure_options'] = '{"interaction":false,"annotation":false}';
        }
    }
    
    $figure['figOccurences'] = isset($figure['figOccurences']) ? $figure['figOccurences'] : 1;

    $data = array(
    	'position' => $figure['position'],
    	'columns' => $figure['columns'],
    	'aspect' => isset($node->field_aspect_ratio) ? $node->field_aspect_ratio['und'][0]['value'] : 1,
        'vertical_position' => substr($figure['position'], 0, 1),
        'horizontal_position' => strlen($figure['position']) > 1 ? substr($figure['position'], 1, 1) : "na",
        'figure_type' => $node->type,
    	'options' => isset($figure['figure_options']) ? htmlspecialchars($figure['figure_options']) : null,
        'occurences' => isset($figure['figOccurences']) ? $figure['figOccurences'] : 1
    );
    // store the options as they are, then strip out the url since it's
    // only needed on the thumbnail
    $options = json_decode(htmlspecialchars_decode($data['options']));
    $tempOptions = json_decode(htmlspecialchars_decode($data['options']));
    unset($tempOptions->previewUrl);
    $data['options'] = htmlspecialchars(json_encode($tempOptions));

    $vars['type'] = $node->type;
    $vars['caption'] = (empty($figure['caption'])) ? '' : trim(check_markup($figure['caption'], $figure['format']));
    $title = isset($figure['number_template']) ? $figure['number_template'] : '';
    $title = trim(strip_tags($title . $vars['caption']));
    $nodeType = $node->type;
    switch ($nodeType) {
    	
        case 'image':
        	if (!isset($node->field_ptiff['und'][0]) && isset($node->field_image['und'][0]) || isset($vars['osci_tk_static_image']))
        	{
        	    $image = array();
        		// ptiff is empty, use the image field for display
        		if (isset($vars['osci_tk_image_cache'])) {
        		    $image[] = theme_image_style(array(
                	    'style_name' => $vars['osci_tk_image_cache'],
            			'path' => $node->field_image['und'][0]['uri'],
                	    'alt' => $title,
        		    	'title' => $title,
            			'attributes' => array(
        		            'class' => $vars['osci_tk_image_cache']
        		        )
            		));
        		} else {
        		    $image[] = theme_image(array(
            			'path' => $node->field_image['und'][0]['uri'],
        		        'alt' => $title,
        		        'title' => $title,
            			'attributes' => array(
        		            'class' => 'osci_tk_image_full'
        		        )
            		));
        		}

        		$imageStyles = array("osci_tk_image_256", "osci_tk_image_512", "osci_tk_image_1024");
        		foreach($imageStyles as $imgStyle) {
        		    $image[] = theme_image_style(array(
                	    'style_name' => $imgStyle,
            			'path' => $node->field_image['und'][0]['uri'],
                	    'alt' => $title,
        		    	'title' => $title,
            			'attributes' => array(
        		            'class' => $imgStyle
        		        )
            		));
        		}

        		$vars['content'] = l(
        		    implode(" ",$image),
        		    file_create_url($node->field_image['und'][0]['uri']),
        		    array(
        		    	'html' => true,
        		    	'attributes' => array('title' => $title)
        		    )
        		);
        		
        		$vars['content'] = str_replace("src=", "data-src=", $vars['content']);
        	}
        	
        	// test is a preview url is available.  If so, use it in the thumbnail below
        	if ($options && isset($options->previewUrl) && $options->previewUrl != '') {
        	    $thumbnailPath = 'public://'.str_ireplace('sites/default/files/', '', $options->previewUrl);
        	} else {
        	    $thumbnailPath = $node->field_image['und'][0]['uri'];
        	}

        	// if the figure has a its own thumbnail, use that
        	if (isset($options->previewUrl)) {
        		$vars['thumbnail'] = $options->previewUrl;
        	}
        	else {
        		$vars['thumbnail'] = theme_image_style(array(
        			'style_name' => "osci_tk_thumbnail_165w",
        			'path' => $thumbnailPath,
        			'alt' => $node->title,
        			'attributes' => array(
        				'data-figure_id' => $figure['id'],
        			    'data-figure_number' => $figure['figCount'],
        			    'data-occurences' => $figure['figOccurences']
        			)
        		));
        	}
	    		    	
        	
    		break;
        
        case 'html_figure':
            $vars['content'] = check_markup($node->field_osci_figure_content['und'][0]['value'], $node->field_osci_figure_content['und'][0]['format']);
            
            if (isset($node->field_image['und'][0]))
            $vars['thumbnail'] = theme_image_style(array(
                'style_name' => "osci_tk_thumbnail_165w",
                'path' => $node->field_image['und'][0]['uri'],
                'alt' => $node->title,
                'attributes' => array(
                    'data-figure_id' => $figure['id'],
                    'data-figure_number' => $figure['figCount'],
                    'data-occurences' => $figure['figOccurences']
                )
            ));
            break;
        
        case 'iip_asset':
        case 'svg_asset':
        case 'image_asset':
        	$node->field_assets['und'][0]['nid'] = $node->nid;
        case 'conservation_asset':
            $data['aspect'] = _osci_tk_conservation_get_conservation_aspect($node);
            $vars['content'] = _osci_tk_conservation_get_conservation_html($node->nid);
            
            // if the figure has a its own thumbnail, use that
            
            // test is a preview url is available.  If so, use it in the thumbnail below
            $use_style = False;
            if ($options && isset($options->previewUri) && $options->previewUri != '') {
            	$thumbnailPath = $options->previewUri;
            	$use_style = True;
            }
            elseif ($options && isset($options->previewUrl) && $options->previewUrl != '') {
            	$thumbnailPath = 'public://'.str_ireplace('sites/default/files/', '', $options->previewUrl);
            } 
            else {
            	$thumbnailPath = $node->field_image['und'][0]['uri'];
            	$use_style = True;
           	}
           	if ($use_style) {
	            $vars['thumbnail'] = theme_image_style(array(
	            	'style_name' => "osci_tk_thumbnail_165w",
	                'path' => $thumbnailPath,
	                'alt' => $node->title,
	                'attributes' => array(
	                	'data-figure_id' => $figure['id'],
	                    'data-figure_number' => $figure['figCount'],
	                    'data-occurences' => $figure['figOccurences']
	            	)
	            ));
           	}
           	else {
	            $vars['thumbnail'] = theme_image(array(
                    'path'		=> $options->previewUrl,
                    'alt'		=> $node->title,
                    'attributes' => array(
                        'data-figure_id' => $figure['id'],
                        'data-figure_number' => $figure['figCount'],
                        'data-occurences' => $figure['figOccurences']
                    )
	            ));
           	}
            break;
    }
    
    $vars['data'] = '';
    foreach($data as $k => $v) {
        $vars['data'] .= 'data-'.$k.'="'.$v.'" ';
    }
    
}

function osci_tk_body_copy_preprocess_body_copy_figure_print(&$vars) {
    $figure = $vars['figure'];
    $node = node_load($figure['figure_reference']);
    
    if (!isset($node->nid)) {
        watchdog("osci_tk_body_copy", "invalid figure reference " . $figure['figure_reference']);
        return;
    }
    node_build_content($node);

    $vars['content'] = "";
    
    if (!isset($figure['figCount'])) {
        $figure['figCount'] = 0;
        $vars['figure']['figCount'] = 0;
    }
    
    if (!isset($figure['catalogNumber'])) {
        $vars['figure']['catalogNumber'] = 0;
    }
    
    $figure['figOccurences'] = isset($figure['figOccurences']) ? $figure['figOccurences'] : 1;


    // store the options as they are, then strip out the url since it's
    // only needed on the thumbnail
    $options = isset($figure['figure_options']) ? htmlspecialchars($figure['figure_options']) : null;
    $options = json_decode(htmlspecialchars_decode($options));

    $vars['type'] = $node->type;
    $vars['caption'] = (empty($figure['caption'])) ? '' : trim(check_markup($figure['caption'], $figure['format']));
    $title = isset($figure['number_template']) ? $figure['number_template'] : '';
    $title = trim(strip_tags($title . $vars['caption']));
    $nodeType = $node->type;
    switch ($nodeType) {
    	
        case 'image':
        	if (!isset($node->field_ptiff['und'][0]) && isset($node->field_image['und'][0]))
        	{
                $image = theme_image_style(array(
                    'style_name' => 'osci_tk_print',
                    'path' => $node->field_image['und'][0]['uri'],
                    'alt' => $title,
                    'title' => $title,
                    'attributes' => array(
                        'class' => $vars['osci_tk_image_cache']
                    )
                ));

        		$vars['content'] = $image;
        	}
    		break;
        
        case 'html_figure':
            $vars['content'] = check_markup($node->field_osci_figure_content['und'][0]['value'], $node->field_osci_figure_content['und'][0]['format']);
            break;
        
        case 'iip_asset':
        case 'svg_asset':
        case 'image_asset':
        	$node->field_assets['und'][0]['nid'] = $node->nid;
        case 'conservation_asset':   
            // test is a preview url is available.  If so, use it in the thumbnail below
            if ($options && isset($options->previewUri) && $options->previewUri != '') {
            	$thumbnailPath = $options->previewUri;
            }
            elseif ($options && isset($options->previewUrl) && $options->previewUrl != '') {
            	$thumbnailPath = 'public://'.str_ireplace('sites/default/files/', '', $options->previewUrl);
            } 
            else {
            	$thumbnailPath = $node->field_image['und'][0]['uri'];
           	}

            $vars['content'] = theme_image_style(array(
                'style_name' => "osci_tk_print",
                'path' => $thumbnailPath,
                'alt' => $title,
                'title' => $title,
                'attributes' => array(
                    'class' => $vars['osci_tk_image_cache']
                )
            ));
           	
            break;
    }
}

function template_preprocess_osci_tk_book_export_pdf(&$variables) {
    global $base_url, $language;

    $variables['title'] = check_plain($variables['title']);
    $variables['base_url'] = $base_url;
    $variables['language'] = $language;
    $variables['language_rtl'] = ($language->direction == LANGUAGE_RTL);
    $variables['head'] = drupal_get_html_head();
}

function template_preprocess_osci_tk_book_node_export_pdf(&$variables) {
    $variables['depth'] = $variables['node']->book['depth'];
    $variables['title'] = check_plain($variables['node']->title);
    $variables['content'] = $variables['node']->rendered;
}
