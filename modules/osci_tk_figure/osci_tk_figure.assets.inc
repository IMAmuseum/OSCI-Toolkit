<?php
/**
 * @file
 * osci_tk_figure.assets.inc
 */

function osci_tk_figure_asset_iip_asset_options_form($form, &$form_state) {
	$attrs = unserialize($form_state['node']->field_ptiff_attr['und'][0]['value']);
	if (isset($attrs['width']) && isset($attrs['height'])) {
		$form_state['node']->field_aspect_ratio['und'][0]['value'] = (float) ($attrs['width'] / $attrs['height']);
	}
	return osci_tk_figure_asset_layered_image_options_form($form, &$form_state);
}

function osci_tk_figure_asset_html_asset_options_form($form, &$form_state) {

	return osci_tk_figure_asset_options_form($form, $form_state);
}

function osci_tk_figure_asset_image_asset_options_form($form, &$form_state) {
	$field_image = $form_state['node']->field_image;
	if (isset($field_image['und'][0]['width']) && isset($field_image['und'][0]['height'])) {
		$form_state['node']->field_aspect_ratio['und'][0]['value'] =
			(float) ($field_image['und'][0]['width'] / $field_image['und'][0]['height']);
	}
	return osci_tk_figure_asset_layered_image_options_form($form, &$form_state);
}

function osci_tk_figure_asset_layered_image_options_form($form, &$form_state) {
	$figureOptions = json_decode($_GET['options']);
    $figureOptions->editing = true;
    $node = node_load(arg(6));

    // Trick the asset options and exit before this function fails miserably
    // there is probably a better way to do this
    if (!$node) {
        $form['option'] = array('#type' => 'item');
        return osci_tk_figure_asset_options_form($form, $form_state);
    }

    $index = arg(5);
    $layeredImageHtml = _osci_tk_epub_generate_figure_document($node, $index, FALSE, time());
    $aspect = isset($figureOptions->aspect) ? $figureOptions->aspect : false;
    if ($aspect === false) {
	    $aspect = isset($node->field_aspect_ratio['und'][0]['value']) ?
	    	$node->field_aspect_ratio['und'][0]['value'] : 1;
	}
    $width = 400;
    $height = (int) ($width / $aspect);
	$form['initial_frame'] = array(
		'#title'    => t('Set Initial Frame'),
		'#type'     => 'item',
		'#markup'   => "<figure style=\"position: relative; margin-top: 20px; width: {$width}px; height: {$height}px;\" "
			."data-options=\"" . htmlentities(json_encode($figureOptions)) . "\">"
			. $layeredImageHtml
			. "</figure>"
			. "<script>jQuery('form[id$=\"-options-form\"] figure').resizable();"
			. "jQuery('form[id$=\"-options-form\"] figure').bind( \"resizestop\", function( event, ui ) {window.LIEditingImage.map.resize(); var newAspect = jQuery('.map').width() / jQuery('.map').height(); jQuery('input[name=\"aspect\"]').val(newAspect);} );"
			. "var li = jQuery('form[id$=\"-options-form\"] .layered_image-asset').first();"
			. "window.LIEditingImage = new LayeredImage(li);</script>",
	);

	$form['reader_options'] = array(
		'#type'     => 'fieldset',
		'#title'    => t('Reader Options'),
	);

	$form['reader_options']['disable_interaction'] = array(
		'#type'             => 'checkbox',
		'#title'            => t('Disable Interaction'),
		'#default_value'    => isset($figureOptions->disable_interaction)
			? $figureOptions->disable_interaction : false,
	);

	$form['reader_options']['disable_annotation'] = array(
		'#type'             => 'checkbox',
		'#title'            => t('Disable Annotation Selection'),
		'#default_value'    => isset($figureOptions->disable_annotation)
			? $figureOptions->disable_annotation : false,
	);

	$form['reader_options']['thumbnail'] = array(
		'#type'             => 'file',
		'#title'            => 'Thumbnail Image',
		'#default_value'    => isset($form_state['options']->thumbnail) ? $form_state['options']->thumbnail : '',
	);

	// figure options queried from layered image preview
	$form['swLon'] = array(
		'#type' => 'hidden',
		'value' => ''
	);
	$form['swLat'] = array(
		'#type' => 'hidden',
		'value' => ''
	);
	$form['neLon'] = array(
		'#type' => 'hidden',
		'value' => ''
	);
	$form['neLat'] = array(
		'#type' => 'hidden',
		'value' => ''
	);
	$form['annotationPreset'] = array(
		'#type' => 'hidden',
		'value' => ''
	);
	$form['baseLayerPreset'] = array(
		'#type' => 'hidden',
		'value' => ''
	);
	$form['sliderPosition'] = array(
		'#type' => 'hidden',
		'value' => ''
	);
	$form['aspect'] = array(
		'#type' => 'hidden',
		'#default_value' => $aspect
	);

	$form['#submit'][] = 'osci_tk_figure_asset_layered_image_options_form_submit';
	$form = osci_tk_figure_asset_options_form($form, $form_state);
	$form['submit']['#suffix'] = "<script>"
		. "var form = jQuery('form[id$=\"-options-form\"]');"
		. "form.find('input[type=\"submit\"]').bind('click', function(event) {"
		. "    var extents = window.LIEditingImage.getExtents();"
		. "    var baseLayerPreset = window.LIEditingImage.getVisibleBaseLayerIds();"
		. "    var annotationPreset = window.LIEditingImage.getVisibleAnnotationIds();"
		. "    var sliderPosition = window.LIEditingImage.getSliderPosition();"
		. "    form.find('input[name=\"swLon\"]').val(extents.swLon);"
		. "    form.find('input[name=\"swLat\"]').val(extents.swLat);"
		. "    form.find('input[name=\"neLon\"]').val(extents.neLon);"
		. "    form.find('input[name=\"neLat\"]').val(extents.neLat);"
		. "    form.find('input[name=\"annotationPreset\"]').val(JSON.stringify(annotationPreset));"
		. "    form.find('input[name=\"baseLayerPreset\"]').val(JSON.stringify(baseLayerPreset));"
		. "    form.find('input[name=\"sliderPosition\"]').val(sliderPosition);"
		. "});</script>";

	return $form;
}

function osci_tk_figure_asset_layered_image_options_form_submit($form, &$form_state) {
	if (!empty($_FILES['files']['name']['thumbnail'])) {
		// Upload the file and save it
		$dest       = 'public://';
		$file = file_save_upload('thumbnail', array(), $dest);
		if (is_object($file)) {
			$form_state['values']['thumbnail'] = $file->fid;
		}
	}
}


