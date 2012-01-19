<?php

function osci_tk_note_ajax_add() {
    ctools_include('modal');
    $args = func_get_args();
    if ($args[0]) {
        $note = osci_tk_note_load($args[0]);
    }

    $form_state = array(
        'ajax'  => TRUE,
        'title' => 'Create a note',
        'note'  => $note[$args[0]],
    );

    $output = ctools_modal_form_wrapper('note_form', $form_state);

    if ($form_state['executed']) {
        $output = array();
        $script = '<script type="text/javascript">jQuery.osci.note.addNotes();</script>';
        $output[] = ajax_command_remove('.note');
        $output[] = ajax_command_append('head', $script);
        $output[] = ctools_modal_command_dismiss();
    }

    print ajax_render($output);
    exit;
}

function osci_tk_note_ajax_save($onid = null) {
    osci_tk_note_save($_POST);
    $node = node_load($_POST['nid']); 

    return drupal_json_output(osci_tk_user_notes($node));
}

function osci_tk_note_ajax_load($onid) {
    ctools_include('modal');
    
    $note = osci_tk_note_load($onid);
    $note = osci_tk_note_view($note);

    $content = drupal_render($note[$onid]->content);
    $output[] = ajax_command_remove('.note');
    $output[] = ajax_command_after('#note-link-' . $onid, $content);

    print ajax_render($output); 
    exit;
}

function osci_tk_note_ajax_delete($onid) {
    if (!is_numeric($onid)) return;

    ctools_include('modal');
    osci_tk_note_delete($onid);

    $script = '<script type="text/javascript">
        (function ($) {
            var highlightSpan = $("span.note-'.$onid.'");
            highlightSpan.find(".note-delete-link").remove();
            highlightSpan.each(function() {
                $(this).replaceWith($(this).html());
            });
            $.osci.note.addNotes();
        })(jQuery);
    </script>';

    $output[] = ajax_command_remove('.note');
    $output[] = ajax_command_append('head', $script);

    print ajax_render($output);
}

function osci_tk_user_notes_ajax($node) {
    global $user;
    $return = null;
    
    if (user_access("view own notes", $user)) {
        $return = drupal_json_output(osci_tk_user_notes($node));
    }
    
    return $return;
}

function osci_tk_citation_ajax() {
    ctools_include('modal');

    $form_state = array(
        'ajax'  => TRUE,
        'title' => 'Citations',
    );

    $output = ctools_modal_form_wrapper('citation_form', $form_state);

    if ($form_state['executed']) {
        $output = array();
        $output[] = ctools_modal_command_dismiss();
    }

    print ajax_render($output);
    exit;
}
