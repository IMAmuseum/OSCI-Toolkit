( function($) {
	var dialogOptions = {
		'zIndex': 10011,
		'modal': true,
		'width': 700
	};
	
	function footnoteDialog(editor) {
		var buttons = [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ];
	
		var elements = [{
			type:           'select',
			id:             'existingFootnote',
			items:          [['', '']],
			label:          'Select a footnote',
			labelLayout:    'horizontal',
			onShow:         existingFootnoteShow,
			editorId:       editor.name,
			className:      'existingFootnote',
			onChange:		function(api) {
				if (api.data.value == "new") {
					$('.newFootnote').show();
				}
				else {
					$('.newFootnote').hide();
				}
			}
		},
		{
			type : 'textarea',
			id : 'newFootnote',
			label: 'Footnote:',
			className: 'newFootnote',
			style: 'display: none;',
			rows : 4,
			cols : 30
		}
		];

		var contents = [{
			id:         'footnote',
			label:      'Add a footnote reference',
			elements:   elements
		}] 
		
		return {
			title:      'Add a footnote reference',
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
		// get all the footnote identifiers and create a select options for them
		var footnotes = $('.footnote_identifier');
		footnotes.each(function(idx) {
			var $this = $(this);
			items = items + '<option value="' + $this.data("fnId") + '">' + (idx) + ' (' + $this.data("fnId") + ')</option>';
		});
		// append a new option
		items = items + '<option value="new">New Footnote</option>';
		// replace the options
		$(id).html('');
		$(id).append(items);
		// if there weren't any existing footnotes found, unhide the new footnote textarea by default
		if (footnotes.length == 0) {
			$('.newFootnote').show();
		}
	}

	function footnoteOk(data) {
		var editor = this.getParentEditor();
		var dialog = CKEDITOR.dialog.getCurrent();
		var existingFootnote = dialog.getValueOf('footnote', 'existingFootnote');
		var replace = existingFootnote;
		
		// hide the footnote textarea so it doesn't show up on next button press
		$('.newFootnote').hide();
		// if the user selected new, create a new footnote, populate it, and change 'replace'
		// to the proper footnote reference
		if (existingFootnote == "new") {
			// get footnote text
			var newFootnote = dialog.getValueOf('footnote', 'newFootnote');
			// create new footnote tab
			$('input[id^="edit-field-footnote-und-add-more"]').trigger('mousedown');
			// wait in a loop until the tab count goes up
			var tabCountStart = $('#fieldset-tabs-field_footnote').find('ul.ui-tabs-nav').find('li').length;
			var interval = setInterval(function() {
				var tabCount = $('#fieldset-tabs-field_footnote').find('ul.ui-tabs-nav').find('li').length;
				if (tabCount > tabCountStart) {
					clearInterval(interval);
					// populate new tab with footnote text
					CKEDITOR.instances['edit-field-footnote-und-' + (tabCount -1) + '-value'].setData(newFootnote);
					replace = $('#fieldset-tab-edit-field-footnote-und-' + (tabCount -1))
						.find('.footnote_identifier')
						.attr('data-fnid');
					editor.insertText('[footnote:' + replace + ']');
				}
			});
		}
		else {
			editor.insertText('[footnote:' + replace + ']');
		}
	}
	
	CKEDITOR.dialog.add('footnote', function(editor) {
		return footnoteDialog(editor);
	});

})(jQuery);
