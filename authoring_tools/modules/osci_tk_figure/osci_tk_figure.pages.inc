<?php

function osci_tk_figure_reference($entity_type, $bundle, $field_name, $queryString = '') 
{
    $field = field_info_field($field_name);
    $instance = field_info_instance($entity_type, $field_name, $bundle);
    
    $types = $instance['widget']['settings']['osci_tk_figure_types'];
    $types = array_keys(array_filter($types));
    
    $figs = db_select('node', 'n')
        ->fields('n', array('type', 'title', 'nid'))
        ->condition('type', $types, 'IN')
        ->condition('status', 1)
        ->condition('title', '%'.db_like($queryString).'%', 'LIKE')
        ->orderBy('created', 'DESC')
        ->addTag('node_access')
        ->range(0, 100)
        ->execute();
    
    $matches = array();
    
    foreach($figs as $result) 
    {   
        $matches[_osci_tk_figure_asset_label($result)] = node_type_get_name($result->type) . ' - ' . $result->title;
    }   
    
    return drupal_json_output($matches);
}

function osci_tk_figure_preview($node) {
    // get node and ensure it's a valid figure type
    $ret = new stdClass();
    $time = time();
    $ret->time = $time;
    $ret->div = ''; 
    
    //invoke hook per content type to load a preview image and get js callback function name for figure options
    $results = array_merge(
        array('image_uri' => null, 'callback' => null),
        module_invoke_all("osci_tk_figure_preview_" . $node->type, $node)
    );  
    
    //Add the image preview to the return
    if ($results['image_uri']) {
        $ret->div = theme_image_style(array(
            'style_name'    => variable_get('osci_tk_image_style_figure_preview', 'osci_tk_default'),
            'path'          => $results['image_uri'],
            'alt'           => $node->title,
            'title'         => $node->title,
            'width'         => null,
            'height'        => null,
            'attributes'    => array(
                'class' => 'preview_image',
            )   
        )); 
    } else {
        $ret->div = '<div class="preview_image">No Preview Available</div>';
    }   
    
    //Add the js callback name to the return
    $ret->callback = $results['callback'];
    $ret->nid = $nid;

    return drupal_json_output($ret);
}

function osci_tk_figure_thumb_save() {
    preg_match('/data:\w+\/(\w+);base64,(.*)/', $_REQUEST['fileDataURI'], $matches);
    $fileType = $matches[1];
    switch($fileType) {
        case "jpeg":
            $ext = 'jpg';
            break;
        case "png":
            $ext = 'png';
            break;
        case "gif":
            $ext = 'gif';
            break;
    }   
    $fileData = base64_decode(str_replace(' ','+',$matches[2]));
    $figureId = $_REQUEST['figureId'];
    $dir = $_SERVER['DOCUMENT_ROOT'].substr(base_path(),1)."/sites/default/files/previews/";
    
    // remove any previous thumbs for this figure
    $dirHandle = opendir($dir);
    while (($file = readdir($dirHandle)) !== FALSE) {
        if (strstr($file, $figureId)) {
            unlink(drupal_realpath("public://previews/".$file));
        }   
    }   
    
    // save the new figure thumb
    $filename = $figureId.'.'.time().'.'.$ext;
    file_put_contents($dir.$filename, $fileData);
    // form the return
    $ret = new stdClass;
    $ret->url = image_style_url(
        variable_get('osci_tk_image_style_figure_preview', 'osci_tk_default'), 
        'public://previews/' . $filename
    );  
    $ret->uri = 'public://previews/' . $filename;
    print json_encode($ret);
}

/**
 * ajax callback for asset options
 */
function osci_tk_figure_asset_options() {
    ctools_include('modal');
    
    $form_state = array(
        'ajax'  => TRUE,
        'title' => t('Asset Options'),
    );

    $form_id = 'osci_tk_figure_asset_' . $node->type . '_options_form';

    // Throw an error if nothing has been implemented for this node type
    if ($form_id == 'osci_tk_figure_asset__options_form') {
        drupal_set_message('Asset options have not been defined for this node type. See osci_tk_figure.api.php for more information', 'error');
    }

    $output = ctools_modal_form_wrapper($form_id, $form_state);

    if ($form_state['executed']) {
        $output[] = ctools_modal_command_dismiss();
    }

    print ajax_render($output);
}
