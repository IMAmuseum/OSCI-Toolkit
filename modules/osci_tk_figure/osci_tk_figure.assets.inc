<?php

function osci_tk_figure_asset_iip_asset_options_form($form, &$form_state) {

	return osci_tk_figure_asset_options_form($form, $form_state); 
}

function osci_tk_figure_asset_layered_image_options_form($form, &$form_state) {
    $figureOptionsObj = $form_state;
    $figureOptions = htmlentities($_GET['options']);
    $node = node_load(arg(6));

    // Trick the asset options and exit before this function fails miserably
    // there is probably a better way to do this
    if (!$node) {
        $form['option'] = array('#type' => 'item');
        return osci_tk_figure_asset_options_form($form, $form_state);
    }

    $index = arg(5);
    $layeredImageHtml = _osci_tk_epub_generate_figure_document($node, $index, FALSE, time());

	$form['initial_frame'] = array(
		'#title'    => t('Set Initial Frame'),
		'#type'     => 'item',
		'#markup'   => "<figure style=\"position: relative; margin-top: 20px; width: 400px; height:400px;\" "
			."data-options=\"$figureOptions\">"
			. $layeredImageHtml 
			. "</figure>"
			. "<script>var li = jQuery('#osci-tk-figure-asset-layered-image-options-form .layered_image-asset').first();"
			. "window.LIEditingImage = new LayeredImage(li);</script>",
	);

	$form['reader_options'] = array(
		'#type'     => 'fieldset',
		'#title'    => t('Reader Options'),
	);

	$form['reader_options']['disable_interaction'] = array(
		'#type'             => 'checkbox',
		'#title'            => t('Disable Interaction'),
		'#default_value'    => isset($form_state['options']->disable_interactions)
			? $form_state['options']->disable_interactions : false,
	);

	$form['reader_options']['disable_annotation'] = array(
		'#type'             => 'checkbox',
		'#title'            => t('Disable Annotation Selection'),
		'#default_value'    => isset($form_state['options']->disable_annotation_selection)
			? $form_state['options']->disable_annotation_selection : false,
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

	$form['#submit'][] = 'osci_tk_figure_asset_layered_image_options_form_submit';
	$form = osci_tk_figure_asset_options_form($form, $form_state);
	$form['submit']['#suffix'] = "<script>"
		. "var form = jQuery('#osci-tk-figure-asset-layered-image-options-form');"
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
	// Upload the file and save it
	$dest       = 'public://';
	$file = file_save_upload('thumbnail', array(), $dest);
	if (is_object($file)) {
		$form_state['values']['thumbnail'] = $file->fid;
	}
}

function osci_tk_figure_asset_image_asset_options_form($form, &$form_state) {

	return osci_tk_figure_asset_options_form($form, $form_state); 
}

function osci_tk_figure_asset_html_asset_options_form($form, &$form_state) {

	return osci_tk_figure_asset_options_form($form, $form_state); 
}
