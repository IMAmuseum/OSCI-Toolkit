<?php

/**
 * Template preprocess function for the OpenSearch description document
 * @param  array &$vars OpenSearch document properties
 */
function template_preprocess_opensearch_description(&$vars) {
	global $base_url, $language;

	$vars['base_url']		= $base_url;
	$vars['long_name'] 		= variable_get('osci_tk_search_long_name', '');
	$vars['short_name'] 	= variable_get('osci_tk_search_short_name', '');
	$vars['description'] 	= variable_get('osci_tk_search_description', '');
	$vars['tags'] 			= variable_get('osci_tk_search_tags', '');
	$vars['contact'] 		= variable_get('osci_tk_search_contact', '');
	$vars['adult_content'] 	= variable_get('osci_tk_search_adult_content', 'FALSE');
	$vars['language'] 		= isset($language->language) ? $language->language : 'en';
}

/**
 * Template preprocess function for OpenSearch results
 * @param  array &$vars OpenSearch results
 */
function template_preprocess_opensearch_results(&$vars) {
	global $base_url, $language;

	$site_search_path = '/api/search';
	$opensearch_path = '/api/opensearch';
	$site_name = variable_get('site_name', 'Drupal');
	// setup template variables
	$vars['keywords'] = arg(2);
	$vars['title'] = $site_name;
	$vars['link'] = $base_url;
	$vars['description'] = 'Search results for ' . $vars['keywords'] . ' at ' . $site_name;
	$vars['language'] = $language->language;
	$vars['result_count'] = $vars['response']->numFound;
	$vars['start_index'] = $vars['response']->start;
	$vars['items_per_page'] = 10;
	$vars['self'] = $base_url . $opensearch_path . '/' . rawurlencode($vars['keywords']);
	$vars['search'] = $base_url . $opensearch_path;
	$vars['alternate'] = $base_url . $site_search_path;

	$vars['content'] = '';
	// create rss content for search results
	foreach($vars['response']->docs as $doc) {
		$title 			= $doc->label;
		$link 			= $doc->url;
		$description 	= $doc->teaser;

		$vars['content'] .= format_rss_item($title, $link, $description);
	}
}