<?php
/**
 * @file
 * osci_tk_features.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function osci_tk_features_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_attachments|node|section|form';
  $field_group->group_name = 'group_attachments';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'section';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_osci';
  $field_group->data = array(
    'label' => 'File Attachments',
    'weight' => '9',
    'children' => array(
      0 => 'field_file',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => ' group-attachments field-group-tab',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_attachments|node|section|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_body|node|section|form';
  $field_group->group_name = 'group_body';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'section';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_osci';
  $field_group->data = array(
    'label' => 'Body',
    'weight' => '8',
    'children' => array(
      0 => 'field_body',
      1 => 'field_authors_body',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => ' group-body field-group-tab',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_body|node|section|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_content|node|section|form';
  $field_group->group_name = 'group_content';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'section';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Content',
    'weight' => '4',
    'children' => array(
      0 => 'group_body',
    ),
    'format_type' => 'tabs',
    'format_settings' => array(
      'formatter' => '',
      'instance_settings' => array(
        'classes' => ' group-content field-group-tabs',
      ),
    ),
  );
  $export['group_content|node|section|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_curatorial_entry|node|section|form';
  $field_group->group_name = 'group_curatorial_entry';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'section';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_osci';
  $field_group->data = array(
    'label' => 'Curatorial Entry',
    'weight' => '10',
    'children' => array(
      0 => 'field_author_curatorial_entry',
      1 => 'field_curatorial_entry',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => ' group-curatorial-entry field-group-tab',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_curatorial_entry|node|section|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_figures_footnotes|node|section|form';
  $field_group->group_name = 'group_figures_footnotes';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'section';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Figures and Footnotes',
    'weight' => '11',
    'children' => array(
      0 => 'group_figures',
      1 => 'group_footnotes',
    ),
    'format_type' => 'tabs',
    'format_settings' => array(
      'formatter' => '',
      'instance_settings' => array(
        'classes' => ' group-figures-footnotes field-group-tabs',
      ),
    ),
  );
  $export['group_figures_footnotes|node|section|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_figures|node|section|form';
  $field_group->group_name = 'group_figures';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'section';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_figures_footnotes';
  $field_group->data = array(
    'label' => 'Figures',
    'weight' => '9',
    'children' => array(
      0 => 'field_figure',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => ' group-figures field-group-tab',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_figures|node|section|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_footnotes_figures|node|section|form';
  $field_group->group_name = 'group_footnotes_figures';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'section';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Footnotes & Figures',
    'weight' => '5',
    'children' => array(
      0 => 'group_figures',
      1 => 'group_footnotes',
    ),
    'format_type' => 'tabs',
    'format_settings' => array(
      'formatter' => '',
      'instance_settings' => array(
        'classes' => ' group-footnotes-figures field-group-tabs',
      ),
    ),
  );
  $export['group_footnotes_figures|node|section|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_footnotes|node|section|form';
  $field_group->group_name = 'group_footnotes';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'section';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_figures_footnotes';
  $field_group->data = array(
    'label' => 'Footnotes',
    'weight' => '10',
    'children' => array(
      0 => 'field_footnote',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => ' group-footnotes field-group-tab',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_footnotes|node|section|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_info|node|section|form';
  $field_group->group_name = 'group_info';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'section';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_osci';
  $field_group->data = array(
    'label' => 'Info',
    'weight' => '7',
    'children' => array(
      0 => 'field_section_image',
      1 => 'field_subtitle',
      2 => 'field_active',
      3 => 'field_navigation_title',
      4 => 'title',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => ' group-info field-group-tab',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_info|node|section|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_osci|node|section|form';
  $field_group->group_name = 'group_osci';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'section';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'OSCI',
    'weight' => '0',
    'children' => array(
      0 => 'group_info',
      1 => 'group_attachments',
      2 => 'group_body',
      3 => 'group_curatorial_entry',
    ),
    'format_type' => 'tabs',
    'format_settings' => array(
      'formatter' => '',
      'instance_settings' => array(
        'classes' => ' group-osci field-group-tabs',
      ),
    ),
  );
  $export['group_osci|node|section|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_publication_content|node|publication|form';
  $field_group->group_name = 'group_publication_content';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'publication';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_publication';
  $field_group->data = array(
    'label' => 'Content',
    'weight' => '12',
    'children' => array(
      0 => 'field_nodetree',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => ' group-publication-content field-group-tab',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_publication_content|node|publication|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_publication_info|node|publication|form';
  $field_group->group_name = 'group_publication_info';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'publication';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_publication';
  $field_group->data = array(
    'label' => 'Info',
    'weight' => '11',
    'children' => array(
      0 => 'field_osci_tk_cover_image',
      1 => 'field_osci_tk_creator',
      2 => 'field_osci_tk_description',
      3 => 'field_osci_tk_publisher',
      4 => 'field_osci_tk_rights',
      5 => 'field_osci_tk_subject',
      6 => 'field_osci_tk_identifier',
      7 => 'field_osci_tk_editor',
      8 => 'field_vocabulary',
      9 => 'field_publication_date',
      10 => 'title',
    ),
    'format_type' => 'tab',
    'format_settings' => array(
      'formatter' => 'closed',
      'instance_settings' => array(
        'description' => '',
        'classes' => ' group-publication-info field-group-tab',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_publication_info|node|publication|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_publication|node|publication|form';
  $field_group->group_name = 'group_publication';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'publication';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Publication',
    'weight' => '11',
    'children' => array(
      0 => 'group_publication_content',
      1 => 'group_publication_info',
    ),
    'format_type' => 'tabs',
    'format_settings' => array(
      'formatter' => '',
      'instance_settings' => array(
        'classes' => ' group-publication field-group-tabs',
      ),
    ),
  );
  $export['group_publication|node|publication|form'] = $field_group;

  return $export;
}
