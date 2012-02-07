CKEDITOR.plugins.add('osci_tk_filters', {
    init: function(editor) {
        // Footnote
        CKEDITOR.dialog.add('footnote', Drupal.settings.osci_tk_filters.modulePath + '/js/dialogs/footnote.js');
        editor.addCommand('footnote', new CKEDITOR.dialogCommand('footnote'));
        editor.ui.addButton('footnote', {
            label: 'Footnote',
            icon: Drupal.settings.osci_tk_filters.modulePath + '/images/footnote_edit.png',
            command: 'footnote'
        });

        // Figure
        CKEDITOR.dialog.add('figure', Drupal.settings.osci_tk_filters.modulePath + '/js/dialogs/figure.js');
        editor.addCommand('figure', new CKEDITOR.dialogCommand('figure'));
        editor.ui.addButton('figure', {
            label: 'Figure Reference',
            icon: Drupal.settings.osci_tk_filters.modulePath + '/images/figure_edit.png',
            command: 'figure'
        });
    }
});

