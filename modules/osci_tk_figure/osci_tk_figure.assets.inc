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
    $figureOptions = isset($_GET['options']) ? json_decode($_GET['options']) : new stdClass();
    $figureOptions->editing = true;
    $node = $form_state['node'];

    // Trick the asset options and exit before this function fails miserably
    // there is probably a better way to do this
    if (!$node) {
        $form['option'] = array('#type' => 'item');
        return osci_tk_figure_asset_options_form($form, $form_state);
    }

    $index = arg(5);

    // invoke HOOK_figure_html_NODETYPE
    $hook = 'figure_html_' . $node->type;
    $return = module_invoke_all($hook, $node);
    if (isset($return[0])) {
        $layeredImageHtml = $return[0];
    }
    else {
        $view = node_view($figure, 'epub');
        $layeredImageHtml = drupal_render($view['field_figure'][$index]);
    }

    $aspect = isset($figureOptions->aspect) ? $figureOptions->aspect : false;
    if ($aspect === false) {
        $aspect = isset($node->field_aspect_ratio['und'][0]['value']) ?
            $node->field_aspect_ratio['und'][0]['value'] : 1;
    }
    $width = 512;
    $height = ($width / $aspect);
    $form['initial_frame'] = array(
        '#title'    => t('Set Initial Frame'),
        '#type'     => 'item',
        '#markup'   => "<figure style=\"position: relative; margin-top: 20px; width: {$width}px; height: {$height}px;\" "
            ."data-options=\"" . htmlentities(json_encode($figureOptions)) . "\">"
            . $layeredImageHtml
            . "</figure>"
            . "<script> window.renderModal = function(context, input) {
                var aspect = ".$aspect.";
                context.find('figure').resizable();
                context.find('figure').bind( \"resizestop\", function( event, ui ) {
                    window.LIEditingImage.map.resize();
                    var newAspect = context.find('.map').width() / context.find('.map').height();
                    aspect = newAspect;
                    context.find('input[name=\"aspect\"]').val(newAspect);
                });
                var li = context.find('figure .layered_image-asset').first();
                window.LIEditingImage = new LayeredImage(li);
                context.find('input[type=\"submit\"]').bind('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var extents = window.LIEditingImage.getExtents();
                    var baseLayerPreset = window.LIEditingImage.getVisibleBaseLayerIds();
                    var annotationPreset = window.LIEditingImage.getVisibleAnnotationIds();
                    var sliderPosition = window.LIEditingImage.getSliderPosition();
                    var currentOpts = {
                        swLon: extents.swLon,
                        swLat: extents.swLat,
                        neLon: extents.neLon,
                        neLat: extents.neLat,
                        annotationPreset: annotationPreset,
                        sliderPosition: sliderPosition,
                        baseLayerPreset: baseLayerPreset,
                        disable_annotation: context.find('input.disable-annotation').attr('checked'),
                        disable_interaction: context.find('input.disable-interaction').attr('checked'),
                        aspect: aspect
                    };
                    input.val(JSON.stringify(currentOpts));
                    input.parents('figure-wrapper').find('a.asset-options').attr('data-formLoaded', 0);
                    $.fancybox.close();
                });
            }
            </script>"
    );
    $form['reader_options'] = array(
        '#type'     => 'fieldset',
        '#title'    => t('Reader Options'),
    );

    $di = isset($figureOptions->disable_interaction) ? $figureOptions->disable_interaction : false;
    $diAttr = array('class' => array('disable-interaction'));
    if ($di) {
        $diAttr['checked'] = "checked";
    }

    $da = isset($figureOptions->disable_annotation) ? $figureOptions->disable_annotation : false;
    $daAttr = array('class' => array('disable-annotation'));
    if ($da) {
        $daAttr['checked'] = "checked";
    }

    $form['reader_options']['disable_interaction'] = array(
        '#type'             => 'checkbox',
        '#title'            => t('Disable Interaction'),
        '#default_value'    => $di,
        '#attributes'       => $diAttr
    );

    $form['reader_options']['disable_annotation'] = array(
        '#type'             => 'checkbox',
        '#title'            => t('Disable Annotation Selection'),
        '#default_value'    => $da,
        '#attributes'       => $daAttr
    );

    $form = osci_tk_figure_asset_options_form($form, $form_state);

    return $form;
}
