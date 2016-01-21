<?php
/**
 * @file
 * Admin settings for TAP Webapp
 */

function osci_tk_webapp_admin_form($form, &$form_state) {

    $form['osci_tk_webapp_base_path'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Web-App Base Path'),
        '#default_value'    => variable_get('osci_tk_webapp_base_path', '/')
    );

    $form['osci_tk_webapp_note_endpoint'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Web-App Note Endpoint'),
        '#default_value'    => variable_get('osci_tk_webapp_note_endpoint', 'http://')
    );

    $form['osci_tk_webapp_search_endpoint'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Web-App Search Endpoint'),
        '#default_value'    => variable_get('osci_tk_webapp_search_endpoint', 'http://')
    );

    $form['osci_tk_webapp_opensearch_endpoint'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Web-App Open Search Endpoint'),
        '#default_value'    => variable_get('osci_tk_webapp_opensearch_endpoint', 'http://')
    );

    $form['osci_tk_webapp_account_endpoint'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Web-App Account Endpoint'),
        '#default_value'    => variable_get('osci_tk_webapp_account_endpoint', 'http://')
    );

    $form['osci_tk_webapp_citation_endpoint'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Web-App Citation Endpoint'),
        '#default_value'    => variable_get('osci_tk_webapp_citation_endpoint', 'http://')
    );

    $form['osci_tk_webapp_template_path'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Web-App Custom Template Path Endpoint'),
        '#default_value'    => variable_get('osci_tk_webapp_template_path', '/')
    );

    $form['osci_tk_webapp_toolbar_items'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Web-App Toolbar Items'),
        '#default_value'    => variable_get('osci_tk_webapp_toolbar_items', "{view: 'Toc', text: 'ToC'},{view: 'Notes', text: 'Notes'},{view: 'Figures', text:' Figures'},{view: 'Glossary', text: 'Glossary'},{view: 'Search', text: 'Search'},{view: 'Font', text: 'Font'},{view: 'Account', text: 'Account'}")
    );

    $form['osci_tk_webapp_section_view'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Web-App Section View'),
        '#default_value'    => variable_get('osci_tk_webapp_section_view', 'MultiColumnSection')
    );

    $form['osci_tk_webapp_section_view_options'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Web-App Section View Options'),
        '#default_value'    => variable_get('osci_tk_webapp_section_view_options', "{minColumnWidth : 200,maxColumnWidth : 300,gutterWidth : 40,minLinesPerColumn : 5,defaultLineHeight: 16}")
    );

    $form['osci_tk_webapp_paragraph_controls'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Web-App Section View'),
        '#default_value'    => variable_get('osci_tk_webapp_paragraph_controls', "{'toggleNoteDialog': 'note','toggleCiteDialog': 'cite'}")
    );

    $form['#submit'][] = 'osci_tk_webapp_admin_form_submit';

    return system_settings_form($form, $form_state);

}

function osci_tk_webapp_admin_form_simple_theme($form, &$form_state){
    $form['osci_tk_webapp_simple_theme_base_path'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Simple Theme Base Path'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_theme_base_path', '/osci-themes/dist/themes/Simple/')
    );

    $form['osci_tk_webapp_simple_theme_template_path'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Simple Theme Custom Template Path Endpoint'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_theme_template_path', '')
    );

    $form['osci_tk_webapp_simple_theme_toolbar_items'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Simple Theme Toolbar Items'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_theme_toolbar_items', '{view: "accountView", text: "account", style: "default"}, {view: "tocView", text: "toc", style: "default"}, {view: "printView", text: "print", style: "inline"}, {view: "fontSizeView", text: "font-size", style: "inline"}')
    );

    $form['osci_tk_webapp_simple_theme_features'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Simple Theme Custom Features'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_theme_features', '{"account": true, "search": false, "notes": true, "citations": true, "glossary": true, "multicolumn": false, "layeredImage": false}')
    );

    $form['osci_tk_webapp_simple_theme_paragraph_controls'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Simple Theme Custom Paragraph Controls'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_theme_paragraph_controls', '{"toggleNoteDialog": "note", "toggleCiteDialog": "cite"}')
    );

    $form['osci_tk_webapp_simple_theme_head'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Simple Theme Custom Head Markup'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_theme_head', '<link href="http://fonts.googleapis.com/css?family=Montserrat:400,700|Merriweather:400,300italic,400italic,700italic,900italic,900,700,300" rel="stylesheet" type="text/css">')
    );

    $form['osci_tk_webapp_simple_theme_footer'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Simple Theme Custom Footer Markup'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_theme_footer', '')
    );

    return system_settings_form($form, $form_state);

}

function osci_tk_webapp_admin_form_simple_horizontal_theme($form, &$form_state){
    $form['osci_tk_webapp_simple_horizontal_theme_base_path'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Simple Horizontal Theme Base Path'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_horizontal_theme_base_path', '/osci-themes/dist/themes/Simple_Horizontal/')
    );

    $form['osci_tk_webapp_simple_horizontal_theme_template_path'] = array(
        '#type'             => 'textfield',
        '#title'            => t('Simple Horizontal Theme Custom Template Path Endpoint'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_horizontal_theme_template_path', '')
    );

    $form['osci_tk_webapp_simple_horizontal_theme_toolbar_items'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Simple Horizontal Theme Toolbar Items'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_horizontal_theme_toolbar_items', '{view: "accountView", text: "account", style: "default"}, {view: "tocView", text: "toc", style: "default"}, {view: "printView", text: "print", style: "inline"}, {view: "fontSizeView", text: "font-size", style: "inline"}')
    );

    $form['osci_tk_webapp_simple_horizontal_theme_features'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Simple Horizontal Theme Custom Features'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_horizontal_theme_features', '{"account": true, "search": false, "notes": true, "citations": false, "glossary": false, "multicolumn": false, "layeredImage": false}')
    );

    $form['osci_tk_webapp_simple_horizontal_theme_paragraph_controls'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Simple Horizontal Theme Custom Paragraph Controls'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_horizontal_theme_paragraph_controls', '{"toggleNoteDialog": "note", "toggleCiteDialog": "cite"}')
    );

    $form['osci_tk_webapp_simple_horizontal_theme_head'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Simple Horizontal Theme Custom Head Markup'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_horizontal_theme_head', '<link href="http://fonts.googleapis.com/css?family=Montserrat:400,700|Merriweather:400,300italic,400italic,700italic,900italic,900,700,300" rel="stylesheet" type="text/css">')
    );

    $form['osci_tk_webapp_simple_horizontal_theme_footer'] = array(
        '#type'             => 'textarea',
        '#title'            => t('Simple Horizontal Theme Custom Footer Markup'),
        '#default_value'    => variable_get('osci_tk_webapp_simple_horizontal_theme_footer', '')
    );

    return system_settings_form($form, $form_state);

}

function osci_tk_webapp_admin_form_multicolumn_theme($form, &$form_state){
    $form['osci_tk_webapp_multicolumn_theme_base_path'] = array(
        '#type'             => 'textfield',
        '#title'            => t('MultiColumn Theme Base Path'),
        '#default_value'    => variable_get('osci_tk_webapp_multicolumn_theme_base_path', '/osci-themes/dist/themes/MultiColumn/')
    );

    $form['osci_tk_webapp_multicolumn_theme_template_path'] = array(
        '#type'             => 'textfield',
        '#title'            => t('MultiColumn Theme Custom Template Path Endpoint'),
        '#default_value'    => variable_get('osci_tk_webapp_multicolumn_theme_template_path', '')
    );

    $form['osci_tk_webapp_multicolumn_theme_head'] = array(
        '#type'             => 'textarea',
        '#title'            => t('MultiColumn Theme Custom Head Markup'),
        '#default_value'    => variable_get('osci_tk_webapp_multicolumn_theme_head', '<link href="http://fonts.googleapis.com/css?family=Montserrat:400,700|Merriweather:400,300italic,400italic,700italic,900italic,900,700,300" rel="stylesheet" type="text/css">')
    );

    $form['osci_tk_webapp_multicolumn_theme_footer'] = array(
        '#type'             => 'textarea',
        '#title'            => t('MultiColumn Theme Custom Footer Markup'),
        '#default_value'    => variable_get('osci_tk_webapp_multicolumn_theme_footer', '')
    );

    return system_settings_form($form, $form_state);

}

function osci_tk_webapp_admin_form_submit($form, &$form_state) {

//     $dest = 'public://';
//     $file = file_save_upload(
//         'tap_webapp_default_theme',
//         array('file_validate_extensions' => array('css')),
//         $dest
//     );

//     if (is_object($file)) {

//         // Remove the previous file
//         $old_file = file_load(variable_get('tap_webapp_default_theme', -1));
//         if (!empty($old_file)) file_delete($old_file);

//         $form_state['values']['tap_webapp_default_theme'] = $file->fid;
//         variable_set('tap_webapp_default_theme', $file->fid);

//     }

}
