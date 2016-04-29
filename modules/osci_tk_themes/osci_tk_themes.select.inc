<?php

/**
 *
 */
function osci_tk_themes_select($node)
{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        setCurrentPublicationTheme($_POST);
    }

    $theme_base_path = $_SERVER['DOCUMENT_ROOT'].'/osci-themes/dist/themes';
    $theme_paths = getAllOsciThemePaths($theme_base_path);
    $themes = getOsciThemeData($theme_paths);

    $publication_data = setPublicationThemeData($node, $themes);

    $data = array(
        'pub' => $publication_data
    );

    //apply theme to node data
    $output = theme('theme_select', array('data' => $data));
    return $output;
}

function getAllOsciThemePaths($path)
{
    return glob($path . '/*' , GLOB_ONLYDIR);
}

function getOsciThemeData($themes)
{
    $data = null;
    foreach ($themes as $theme) {
        $images = glob("{$theme}/screenshot.{jpg,jpeg,gif,png}", GLOB_BRACE);
        $screenshot = count($images) > 0 ? basename($images[0]) : null;
        $theme_name = basename($theme);
        $data[$theme_name] = array(
            'name' => $theme_name,
            'screenshot' => $screenshot
        );
    }
    return $data;
}

function setPublicationThemeData($publication, $themes)
{
    $theme = $publication->field_osci_tk_theme['und'][0]['value'];
    $current = $themes[$theme];
    unset($themes[$theme]);
    $data = array(
        'vid' => $publication->vid,
        'title' => $publication->title,
        'themes' => array(
            'current' => $current,
            'others'  => $themes
        ),
    );
    return $data;
}

function setCurrentPublicationTheme($data)
{
    $config_json = getOscitkConfigJson($data['theme'], $data['vid']);
    $publication = node_load($data['vid']);
    $publication->field_osci_tk_theme['und'][0]['value'] = $data['theme'];
    $publication->field_osci_tk_theme_settings['und'][0]['value'] = $config_json;
    node_save($publication);
    drupal_set_message(t($publication->title . ' theme set to ' . $data['theme']), 'status', FALSE);
}


