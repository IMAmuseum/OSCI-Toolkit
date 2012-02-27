( function($) {
	function figureDialog(editor) {
		var buttons = [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ];
		var figures = $('.figure_identifier');
		var items = [];
		
		figures.each(function(idx) {
			var $this = $(this);
			items.push([(idx) + ' (' + $this.data("figId") + ')', $this.data("figId")]);
		});
		items.push(['New Figure', 'new']);
		
		var elements = [{
			type:           'select',
			id:             'figureId',
			items:          items,
			label:          'Select a figure',
			labelLayout:    'horizontal'
		}];
		
		var contents = [{
			id:             'figure',
			label:          'Add figure',
			elements:       elements
		}]; 
		
		return {
			title:          'Add a figure',
			minWidth:       400,
			minHeight:      100,
			buttons:        buttons,
			resizable:      'none',
			contents:       contents,
			onOk:           figureOk
		}
	}

	function figureOk(data) {
		var editor = this.getParentEditor(),
			dialog = CKEDITOR.dialog.getCurrent(),
			figureId = dialog.getValueOf('figure', 'figureId'),
			replace;
	
		if (figureId == 'new') {
			// create new figure tab
			$('input[id^="edit-field-figure-und-add-more"]').trigger('mousedown');
			// wait in a loop until the tab count goes up
			var tabCountStart = $('#fieldset-tabs-field_figure').find('ul.ui-tabs-nav').find('li').length;
			var interval = setInterval(function() {
				var tabCount = $('#fieldset-tabs-field_figure').find('ul.ui-tabs-nav').find('li').length;
				if (tabCount > tabCountStart) {
					clearInterval(interval);
					replace = $('#fieldset-tab-edit-field-figure-und-' + (tabCount -1))
						.find('.figure_identifier')
						.attr('data-figid');
					editor.insertText('[figure:' + replace + ']');
					// ensure the figures vert tab is selected
					$('li.vertical-tab-button').each(function() {
						var tab = $(this);
						if (tab.find('strong').text() == 'Figures') {
							tab.find('a').click();
						}
					});
				}
			});
		}
		else {
			replace = figureId;
			editor.insertText('[figure:' + replace + ']');
		}
	}
	
	CKEDITOR.dialog.add('figure', function(editor) {
		return figureDialog(editor);
	});
})(jQuery);
