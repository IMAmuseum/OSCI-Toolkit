<?php

/**
 *
 */
function osci_tk_themes_settings($nid)
{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        setCurrentPublicationThemeSettings($_POST);
    }

    global $user;
    $uid = $user->uid;
    $publication = node_load($nid);

    if ($publication->uid === $uid) {
        $data = array(
            'publication' => $publication,
        );

        //apply theme to node data
        $output = theme('theme_settings', array('data' => $data));
        return $output;
    }
}

function setCurrentPublicationThemeSettings($data)
{
    $publication = node_load($data['vid']);
    $theme = $publication->field_osci_tk_theme['und'][0]['value'];
    $publication->field_osci_tk_theme_settings['und'][0]['value'] = $data['theme-settings'];
    node_save($publication);
    drupal_set_message(t($publication->title . ' - ' . $theme . ' settings updated.'), 'status', FALSE);
}
