<?php

/**
 *  @file
 *  Administrative page callbacks for Media: Nuxeo.
 */

/**
 * Callback for /admin/configure/media/media_nuxeo.
 */
function media_nuxeo_settings_form() {
    $form = array();
    $form['api'] = array(
        '#type' => 'fieldset',
        '#title' => t('Nuxeo Credentials'),
        '#collapsible' => FALSE,
    );
    $form['api']['media_nuxeo__url'] = array(
        '#type' => 'textfield',
        '#title' => t('Nuxeo Url'),
        '#default_value' => variable_get('media_nuxeo__url', ''),
        '#description' => t('Please enter the Nuxeo automation url.'),
    );
    $form['api']['media_nuxeo__login'] = array(
        '#type' => 'textfield',
        '#title' => t('Nuxeo Login'),
        '#default_value' => variable_get('media_nuxeo__login', ''),
        '#description' => t('Please enter the Nuxeo login.'),
    );
    $form['api']['media_nuxeo__password'] = array(
        '#type' => 'textfield',
        '#title' => t('Nuxeo Password'),
        '#default_value' => variable_get('media_nuxeo__password', ''),
        '#description' => t('Please enter the Nuxeo password.'),
    );    
    return system_settings_form($form);
}