<?php

/**
 *
 */
function osci_tk_themes_settings($nid)
{
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
