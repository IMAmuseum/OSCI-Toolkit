<?php

/**
 * @file
 * Define MediaInternetNuxeoHandler class.
 */
class MediaInternetNuxeoHandler extends MediaInternetBaseHandler {

    public $fileObject, $uri;
    private $session, $uuid;

    public function claim($embedCode) {
        // Claim only valid URLs using a supported scheme and those from Nuxeo.
        if (!valid_url($embedCode, TRUE) || !preg_match('@nxdoc/default/[a-zA-Z0-9-]+@', $embedCode)) {
            return FALSE;
        }
        return TRUE;
    }

    public function getFileObject() {
        $this->parseNuxeoUrl();
        if (!$this->fileObject) {
            $this->fileObject = file_uri_to_object($this->uri);
        }
        return $this->fileObject;
    }

    public function preSave(&$file_obj) {
        $data = $this->getNuxeoSession()->newRequest("Blob.Get")->set('input', 'doc:' . $this->uuid)->sendRequest();

        if (!@file_put_contents($this->uri, $data)) {
            throw new Exception('Unable to add file.');
            return;
        }
        $file_obj = file_uri_to_object($this->uri);
    }

    public function postSave(&$file_obj) {
        $scheme = variable_get('file_default_scheme', 'public') . '://';
        $uri = file_stream_wrapper_uri_normalize($scheme . $file_obj->filename);
        $file_obj = file_move($file_obj, $uri, FILE_EXISTS_RENAME);
    }

    private function parseNuxeoUrl() {
        preg_match('@nxdoc/default/([a-zA-Z0-9-]+)@', $this->embedCode, $matches);
        $this->uuid = $matches[1];

        $response = $this->getNuxeoSession()
            ->newRequest('Document.Fetch')
            ->set('params', 'value', $this->uuid)
            ->setSchema()
            ->sendRequest();

        $document = $response->getDocument(0)->getObject();
        $local_filename = $document['properties']['file:content']['name'];
        $local_filename = file_munge_filename($local_filename, media_variable_get('file_extensions'), FALSE);
        $this->uri = file_stream_wrapper_uri_normalize('temporary://' . $local_filename);
    }

    private function getNuxeoSession() {
        include_once libraries_get_path('NuxeoAutomationClient') . '/NuxeoAutomationAPI.php';

        if ($this->session) {
            return $this->session;
        } else {
            $host = variable_get('media_nuxeo__url');
            $login = variable_get('media_nuxeo__login');
            $password = variable_get('media_nuxeo__password');
            $client = new NuxeoPhpAutomationClient($host);
            return $client->getSession($login, $password);
        }
    }
}