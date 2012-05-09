<?php

function osci_tk_epub_publish_form($form, &$form_state, $nid)
{
	$form = array();
	$node = node_load($nid);
	if ($node->type === 'publication') {
		$form_state['nid'] = $nid;
		
		$form['publish_epub'] = array(
				'#type'     => 'submit',
				'#value'    => t('Publish ePub'),
		);
	}

    return $form;
}

function osci_tk_epub_publish_form_submit($form, &$form_state)
{
	// Check for presense of zip extension
    if (!class_exists('ZipArchive')) {
        drupal_set_message("You must install the php zip extension to publish.", 'error');
        return;
    }
	
	$node = node_load($form_state['nid']);
	if ($node->type !== 'publication') 
	{
		return null;
	}
	
	//create epub directory if not already created
	if (!is_dir(drupal_realpath('public://epub'))) {
		drupal_mkdir('public://epub');
	}
	
	$epubTitle = _osci_tk_clean_filename_string($node->title);
	$epubFilePath = 'public://epub/' . $epubTitle . '.epub';
	
	// If we have a stale tmp file delete it
    if (file_exists($epubFilePath)) {
        unlink($epubFilePath);
    }
	
	$operations = array(
		array(
			'osci_tk_epub_publish_create_container', 
			array($epubFilePath, $form_state['nid'])
		),
		array(
			'osci_tk_epub_publish_create_container_file',
			array($epubFilePath)
		),
		array(
			'osci_tk_epub_publish_get_package',
			array($epubFilePath, $form_state['nid'])
		),
		array(
			'osci_tk_epub_publish_get_nav',
			array($epubFilePath, $form_state['nid'])
		),
		array(
			'osci_tk_epub_publish_get_ncx',
			array($epubFilePath, $form_state['nid'])
		),
		array(
			'osci_tk_epub_publish_book_resources',
			array($epubFilePath, $node)
		)
	);
	
	$data = _osci_tk_epub_get_book_resources($node);

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
        'title'         => t('ePub 3.0 Bundle Export'),
        'operations'    => $operations,
        'finished'      => 'osci_tk_epub_publish_finish',
        'file'          => drupal_get_path('module', 'osci_tk_epub') . '/osci_tk_epub.publish.inc',
    );

    batch_set($batch);
}

function osci_tk_epub_publish_finish($success, $results, $operations)
{
	$fileUrl = file_create_url($results['epub_file']);

	if ($success) {
        $message = 'ePub has been created with ' . format_plural(count($results['files']), 'One file included', '@count files included') . '. <a href="' . $fileUrl . '">Download: ' . $fileUrl . '</a>';
    } else {
        $message = t('An error occurred');
    }

    drupal_set_message($message);

    drupal_goto("node/" . $results['nid']);
}

function osci_tk_epub_publish_create_container($epubFile, $nid, &$context)
{
	$context['results']['files'] = array();
	$context['results']['nid'] = $nid;
	
	$epub = _osci_tk_epub_zip_init($epubFile, ZIPARCHIVE::CREATE);
	if ($epub)
	{
		$fileName = 'mimetype';
		$epub->addFromString($fileName , theme("osci_tk_epub_mimetype"));
		$epub->addEmptyDir("META-INF");
		$epub->addEmptyDir("OEBPS");
		$epub->addEmptyDir("OEBPS/resources");
		$epub->close();
		$context['results']['epub_file'] = $epubFile;
	}
}

function osci_tk_epub_publish_create_container_file($epubFile, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
		$fileName = 'META-INF/container.xml';
		$rootPath = 'OEBPS/package.opf';
		$epub->addFromString($fileName, theme("osci_tk_epub_container_xml", array("rootPath" => $rootPath)));
		$epub->close();
		
		$context['results']['files'][] = $fileName;
	}
}

function osci_tk_epub_publish_get_package($epubFile, $nid, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
		$node = node_load($nid);
		$fileName = 'OEBPS/package.opf';
		$epub->addFromString($fileName, _osci_tk_epub_generate_package_document($node, true, true));
		$epub->close();
		
		$context['results']['files'][] = $fileName;
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
		
		$context['results']['files'][] = $fileName;
	}
}

function osci_tk_epub_publish_get_ncx($epubFile, $nid, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
		$node = node_load($nid);
		$fileName = 'OEBPS/toc.ncx';
		$epub->addFromString($fileName, _osci_tk_epub_generate_ncx_document($node, true, true));
		$epub->close();
		
		$context['results']['files'][] = $fileName;
	}
}

function osci_tk_epub_publish_content_document($epubFile, $content, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
		global $osci_tk_view_mode;
		$osci_tk_view_mode = 'epub';

	    $node = node_load($content['nid']);
		$fileName = 'OEBPS/' . _osci_tk_epub_node_content_filename($node->nid);
		$epub->addFromString($fileName, _osci_tk_epub_generate_content_document($node, true, true));
		$epub->close();
		
		$context['results']['files'][] = $fileName;
	}
}

function osci_tk_epub_publish_figure_document($epubFile, $figure, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{
		$node = node_load($figure['nid']);
		
		if (isset($figure['content-doc'])) 
		{
			$fileName = 'OEBPS/' . _osci_tk_epub_node_figure_filename($node->nid, $figure['index']);
			$epub->addFromString($fileName, _osci_tk_epub_generate_figure_document($node, $figure['index'], true));
			$context['results']['files'][] = $fileName;
		}
		
		foreach($figure['resources'] as $index => $item) 
		{
			$fileName = 'OEBPS/' . _osci_tk_epub_asset_process_uri($item['uri'], true);
			$epub->addFile(drupal_realpath($item['uri']), $fileName);  
			$context['results']['files'][] = $fileName;
		}
		
		$epub->close();
	}
}

function osci_tk_epub_publish_book_resources($epubFile, $node, &$context)
{
	$epub = _osci_tk_epub_zip_init($epubFile);
	if ($epub)
	{

		//Cover Image
		if (isset($node->field_osci_tk_cover_image) && $node->field_osci_tk_cover_image['und'][0])
		{
			$fileName = 'OEBPS/' . _osci_tk_epub_asset_process_uri($node->field_osci_tk_cover_image['und'][0]['uri'], true);
			$epub->addFile(drupal_realpath($node->field_osci_tk_cover_image['und'][0]['uri']), $fileName);  
			$context['results']['files'][] = $fileName;
		}

		//CSS
		if (isset($node->field_osci_tk_css) && $node->field_osci_tk_css['und'][0])
		{
			$fileName = 'OEBPS/' . _osci_tk_epub_asset_process_uri($node->field_osci_tk_css['und'][0]['uri'], true);
			$epub->addFile(drupal_realpath($node->field_osci_tk_css['und'][0]['uri']), $fileName);  
			$context['results']['files'][] = $fileName;
		}
		
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