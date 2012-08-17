if (Drupal.settings.osci_tk_filters) {
    CKEDITOR.plugins.add('osci_tk_filters', {
        init: function(editor) {
            // Footnote
            CKEDITOR.dialog.add('footnote_reference', Drupal.settings.osci_tk_filters.modulePath + '/js/dialogs/footnote.js');
            editor.addCommand('footnote_reference', new CKEDITOR.dialogCommand('footnote_reference'));
            editor.ui.addButton('footnote_reference', {
                label: 'Footnote Reference',
                icon: Drupal.settings.osci_tk_filters.modulePath + '/images/footnote_edit.png',
                command: 'footnote_reference'
            });

            // Figure Reference
            CKEDITOR.dialog.add('figure_reference', Drupal.settings.osci_tk_filters.modulePath + '/js/dialogs/figure_reference.js');
            editor.addCommand('figure_reference', new CKEDITOR.dialogCommand('figure_reference'));
            editor.ui.addButton('figure_reference', {
                label: 'Figure Reference',
                icon: Drupal.settings.osci_tk_filters.modulePath + '/images/photo_link.png',
                command: 'figure_reference'
            });

            // Figure
            CKEDITOR.dialog.add('figure', Drupal.settings.osci_tk_filters.modulePath + '/js/dialogs/figure.js');
            editor.addCommand('figure', new CKEDITOR.dialogCommand('figure'));
            editor.ui.addButton('figure', {
                label: 'Figure',
                icon: Drupal.settings.osci_tk_filters.modulePath + '/images/photo_add.png',
                command: 'figure'
            });
        }
    });
}