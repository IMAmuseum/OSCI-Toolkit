<?php

function osci_tk_epub_publish_form($form, &$form_state, $nid)
{
	$form = array();

    $form_state['nid'] = $nid;

    $form['publish_epub'] = array(
        '#type'     => 'submit',
        '#value'    => t('Publish ePub'),
    );

    return $form;
}

function osci_tk_epub_publish_form_submit($form, &$form_state)
{
	// Check for presense of zip extension
    if (!class_exists('ZipArchive')) {
        drupal_set_message("You must install the php zip extension to publish.", 'error');
        return;
    }
	
	$currentNode = node_load($form_state['nid']);
	
	if (!isset($currentNode->book)) 
	{
		return null;
	}
	
	//create epub directory if not already created
	if (!is_dir(drupal_realpath('public://epub'))) {
		drupal_mkdir('public://epub');
	}
	
	$epubTitle = _osci_tk_clean_filename_string($currentNode->book['link_title']);
	$epubFilePath = 'public://epub/' . $epubTitle . '.zip';
	
	// If we have a stale tmp file delete it
    if (file_exists($epubFilePath)) {
        unlink($epubFilePath);
    }
	
	$operations = array(
		array(
			'osci_tk_epub_publish_create_container', 
			array($epubFilePath)
		),
		array(
			'osci_tk_epub_publish_create_mimetype_file',
			array($epubFilePath)
		),
		array(
			'osci_tk_epub_publish_create_container_file',
			array($epubFilePath, $epubTitle)
		),
		array(
			'osci_tk_epub_publish_get_package',
			array($epubFilePath, $epubTitle, $form_state['nid'])
		),
		array(
			'osci_tk_epub_publish_get_nav',
			array($epubFilePath, $form_state['nid'])
		)
	);
	
	$data = _osci_tk_epub_get_book_resources(node_load($currentNode->book['bid']));
	if (count($data['content_nids']))
	{
		foreach($data['content_nids'] as $content)
		{
			$operations[] = array(
				'osci_tk_epub_publish_content_document',
				array($epubFilePath, $content)
			);
		}
	}
	
	if (count($data['figures']))
	{
		foreach($data['figures'] as $figure)
		{
			$operations[] = array(
				'osci_tk_epub_publish_figure_document',
				array($epubFilePath, $figure)
			);
		}
	}
	
	
	$batch = array(
        'title'         => t('TourML Bundle Export'),
        'operations'    => $operations,
        'finished'      => 'osci_tk_epub_publish_finish',
        'file'          => drupal_get_path('module', 'osci_tk_epub') . '/osci_tk_epub.publish.inc',
    );

    batch_set($batch);
}

function osci_tk_epub_publish_finish($success, $results, $operations)
{
	
}

function osci_tk_epub_publish_create_container($epubFile, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile, ZIPARCHIVE::CREATE);
	if ($epub)
	{
		$epub->addEmptyDir("META-INF");
		$epub->addEmptyDir("OEBPS");
		$epub->close();
	}
}

function osci_tk_epub_publish_create_mimetype_file($epubFile, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
		$epub->addFromString("mimetype" , theme("osci_tk_epub_mimetype"));
		$epub->close();	
	}
}

function osci_tk_epub_publish_create_container_file($epubFile, $epubTitle, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
		$fileName = 'META-INF/container.xml';
		$rootPath = 'OEBPS/' . $epubTitle . '.opf';
		$epub->addFromString($fileName, theme("osci_tk_epub_container_xml", array("rootPath" => $rootPath)));
		
		$epub->close();
	}
}

function osci_tk_epub_publish_get_package($epubFile, $epubTitle, $nid, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
		$node = node_load($nid);
		$fileName = 'OEBPS/' . $epubTitle . '.opf';
		$epub->addFromString($fileName, _osci_tk_epub_generate_package_document($node, true, true));
		$epub->close();
	}
}

function osci_tk_epub_publish_get_nav($epubFile, $nid, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
		$node = node_load($nid);
		$fileName = 'OEBPS/nav.xhtml';
		$epub->addFromString($fileName, _osci_tk_epub_generate_navigation_document($node, true, true));
		$epub->close();
	}
}

function osci_tk_epub_publish_content_document($epubFile, $content)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
	    $node = node_load($content['nid']);
		$fileName = 'OEBPS/ ' . _osci_tk_epub_node_content_filename($node);
		$epub->addFromString($fileName, _osci_tk_epub_generate_content_document($node, true, true));
		$epub->close();
	}
}

function osci_tk_epub_publish_figure_document($epubFile, $figure)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
		$node = node_load($figure['nid']);
		$fileName = 'OEBPS/ ' . _osci_tk_epub_node_figure_filename($node, $figure['index']);
		$epub->addFromString($fileName, _osci_tk_epub_generate_figure_document($node, $figure['index'], true));
		$epub->close();
	}
}

function _osci_tk_epub_zip_init($path, $flag = ZIPARCHIVE::CHECKCONS) {
    $zip = new ZipArchive();
	$path = drupal_realpath($path);

    if ($zip->open($path, $flag) !== TRUE) {
        drupal_set_message("Could not use file $path", 'error');
        return FALSE;
    }

    return $zip;
}