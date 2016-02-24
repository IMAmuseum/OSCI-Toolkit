<?php

/**
 *
 */
function osci_tk_themes_select()
{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        setCurrentPublicationTheme($_POST);
    }

    global $user;
    $uid = $user->uid;
    $publications = getUserPublications($uid);
    $publication_nodes = null;
    $theme_base_path = $_SERVER['DOCUMENT_ROOT'].'/osci-themes/dist/themes';
    $theme_paths = getAllOsciThemePaths($theme_base_path);
    $themes = getOsciThemeData($theme_paths);

    if (!$publications) {
        drupal_set_message(t('You do not have any publications.'), 'warning');
    }

    if ($publications) {
        $publication_keys = array_keys($publications['node']);
        foreach ($publication_keys as $publication_id) {
            $publication_data[] = setPublicationThemeData(node_load($publication_id), $themes);
        }
    }


    $data = array(
        'publications' => $publication_data
    );

    //apply theme to node data
    $output = theme('theme_select', array('data' => $data));
    return $output;
}

function getUserPublications($uid)
{
    $query =  new EntityFieldQuery();
    $query->entityCondition('entity_type', 'node')
        ->entityCondition('bundle', 'publication')
        ->propertyCondition('uid', $uid, '=')
        ->propertyOrderBy('created', 'DESC');
    $result = $query->execute();
    return $result;
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
    $publication = node_load($data['vid']);
    $publication->field_osci_tk_theme['und'][0]['value'] = $data['theme'];
    node_save($publication);
    drupal_set_message(t($publication->title . ' theme set to ' . $data['theme']), 'status', FALSE);
}
