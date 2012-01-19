<?php

/***********************************************
 * Class to provide CRUD functions for note entity
 */
class NoteEntityController extends DrupalDefaultEntityController {

    public function access($op, $note) {
        global $user;
        $note = (is_array($note)) ? end($note) : $note;
        if (!is_object($note)) return FALSE;

        if (user_access('administer notes')) return TRUE;
        switch($op) {
            case 'view':
                if (user_access('view own notes') && $user->uid == $note->uid) return TRUE;
                break;
            case 'edit':
            case 'create':
                if (user_access('create note')) return TRUE;
                break;
        }
        return FALSE;
    }

    public function save($note) {
        global $user;
        $note = (object)$note;
        if (!$note->uid) $note->uid = $user->uid;

        $transaction = db_transaction();

        field_attach_presave('note', $note);

        try {
            if (isset($note->onid)) {
                drupal_write_record('note', $note, 'onid');
                field_attach_update('note', $note);
            } else {
                drupal_write_record('note', $note);
                field_attach_insert('note', $note);
            }

            return $note;
        }
        catch (Exemption $e) {
            $transaction->rollback('note');
            watchdog_exception('note', $e);
            throw $e;
        }
    }

    public function view($notes, $view_mode = 'full') {
        global $user;

        foreach ($notes as $onid => $note) {
            if (!$this->access('view', $note)) continue;

            $notes[$onid]->content = array();

            field_attach_prepare_view('note', array($onid => $note), $view_mode);
            entity_prepare_view('note', array($onid => $note));
            $notes[$onid]->content += field_attach_view('note', $note, $view_mode);
            $notes[$onid]->content += array(
                '#theme'        => 'note',
                '#note'     => $notes[$onid],
                '#view_mode'    => $view_mode,
            );

        }
        return $notes;
    }

    public function build($notes) {
        $notes = $this->view($notes);
        $output = '';

        foreach($notes as $onid => $note) {
            $output .= drupal_render($note->content);
        }
        
        return $output;
    }

    public function delete($onid) {
        $note = note_load($onid);

        if ($note) {
            $transaction = db_transaction();

            try {
                db_delete('note')->condition('onid', $onid)->execute();
                field_attach_delete('note', $note);
            }
            catch (Exception $e) {
                $transaction->rollback();
                watchdog_exception('note', $e);
                throw $e;
            }
        }
    }

}
