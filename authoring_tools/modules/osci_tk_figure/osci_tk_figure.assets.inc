<?php

function osci_tk_figure_asset_iip_asset_options_form($form, &$form_state) {

    return osci_tk_figure_asset_options_form($form, $form_state); 
}

function osci_tk_figure_asset_image_asset_options_form($form, &$form_state) {

    $form['initial_frame'] = array(
        '#title'    => t('Set Initial Frame'),
        '#type'     => 'item',
        '#markup'   => t('TODO: Custom widget for setting frame'),
    );

    $form['reader_options'] = array(
        '#type'     => 'fieldset',
        '#title'    => t('Reader Options'),
    );

    $form['reader_options']['disable_interactions'] = array(
        '#type'             => 'checkbox',
        '#title'            => t('Disable Interaction'),
        '#default_value'    => $form_state['options']->disable_interactions,
    );

    $form['reader_options']['disable_annotation_selection'] = array(
        '#type'             => 'checkbox',
        '#title'            => t('Disable Annotation Selection'),
        '#default_value'    => $form_state['options']->disable_annotation_selection,
    );

    $form['reader_options']['thumbnail'] = array(
        '#type'             => 'file',
        '#title'            => 'Thumbnail Image',
        '#default_value'    => $form_state['options']->thumbnail,
    );

    $form['#submit'][] = 'osci_tk_figure_asset_image_asset_options_form_submit';

    return osci_tk_figure_asset_options_form($form, $form_state);
}

function osci_tk_figure_asset_image_asset_options_form_submit($form, &$form_state) {
    // Upload the file and save it
    $dest       = 'public://';
    $file = file_save_upload('thumbnail', array(), $dest);
    if (is_object($file)) {
        $form_state['values']['thumbnail'] = $file->fid;
    }
}

function osci_tk_figure_asset_html_asset_options_form($form, &$form_state) {

    return osci_tk_figure_asset_options_form($form, $form_state); 
}
