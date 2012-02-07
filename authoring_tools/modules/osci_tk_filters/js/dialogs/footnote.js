( function($) {
    function footnoteDialog(editor) {
        var buttons = [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ];
    
        var elements = [{
            type:           'select',
            id:             'existingFootnote',
            items:          [['', '']],
            label:          'Select a footnote',
            labelLayout:    'horizontal',
            onShow:         existingFootnoteShow,
            editorId:       editor.name
        }];

        var contents = [{
            id:     'footnote',
            label:  'Add a footnote reference',
            elements:   elements
        }] 
        
        return {
            title: 'Add a footnote reference',
            minWidth:   400,
            minHeight:  100,
            buttons:    buttons,
            resizable:  'none',
            contents:   contents,
            onOk:       footnoteOk
        }
    }

    function existingFootnoteShow(data) {
        var items = '';
        var id = '#' + $(this.getInputElement().$).attr('id');
        var footnotes = $('.footnote_identifier');

        footnotes.each(function(idx) {
			var $this = $(this);
            items = items + '<option value="' + $this.data("fnId") + '">' + (idx) + ' (' + $this.data("fnId") + ')</option>';
        });

        $(id).html('');
        $(id).append(items);
    }

    function footnoteOk(data) {
        var editor = this.getParentEditor();
        var dialog = CKEDITOR.dialog.getCurrent();
        var existingFootnote = dialog.getValueOf('footnote', 'existingFootnote');
    
        if (existingFootnote != '') {
            var replace = existingFootnote;
        }

        editor.insertText('[footnote:' + replace + ']');
    }

    CKEDITOR.dialog.add('footnote', function(editor) {
        return footnoteDialog(editor);
    });

})(jQuery);
