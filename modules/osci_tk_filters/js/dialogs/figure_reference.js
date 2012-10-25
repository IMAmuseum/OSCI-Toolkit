( function($) {
	function figureReferenceDialog(editor) {
		var buttons = [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ];

		var elements = [{
			type:           'select',
			id:             'figureId',
			items:          [],
			label:          'Select a figure',
			labelLayout:    'horizontal',
			setup:          function(){
				var figures = $('.figure_identifier');
				var selectElement = $('#' + this.getInputElement().$.id).get(0);
				selectElement.options = [];

				figures.each(function(idx) {
					var $this = $(this);
					selectElement.options[idx] = new Option((idx) + ' (' + $this.data("figId") + ')', $this.data("figId"));
				});
				selectElement.options[selectElement.options.length] = new Option('New Figure', 'new');
			}
		}];

		var contents = [{
			id:             'figure',
			label:          'Add figure',
			elements:       elements
		}];

		return {
			title:          'Add a figure reference',
			minWidth:       400,
			minHeight:      100,
			buttons:        buttons,
			resizable:      'none',
			contents:       contents,
			onOk:           figureReferenceOk,
			onShow:         function(){
				this.setupContent();
			}
		};
	}

	function figureReferenceOk(data) {
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
			editor.insertText('[figureref:' + replace + ']');
		}
	}

	CKEDITOR.dialog.add('figure_reference', function(editor) {
		return figureReferenceDialog(editor);
	});
})(jQuery);
