<?php

/**
 *
 */
function osci_tk_admin_overview()
{
    $tutorial_url = 'https://raw.githubusercontent.com/IMAmuseum/OSCI-Toolkit/gh-pages/tutorials.html';

    $ch = curl_init($tutorial_url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$tutorials = get_content('section', curl_exec($ch));

    //apply theme to node data
    $output = theme('overview', array('data' => $tutorials));
    return $output;
}


function get_content($tag, $content)
{
    preg_match("/<".$tag."[^>]*>(.*?)<\/$tag>/si", $content, $matches);
    return $matches[1];
}