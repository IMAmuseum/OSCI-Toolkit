( function($) {
	function figureDialog(editor) {
		var buttons = [ CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton ];
		var figures = $('.figure_identifier');
		var items = [['', '']];
		
		figures.each(function(idx) {
			var $this = $(this);
			items.push([(idx) + ' (' + $this.data("figId") + ')', $this.data("figId")]);
		});
		
		var elements = [{
			type:           'text',
			id:             'figureId',
			label:          'Enter a figure ID',
			labelLayout:    'horizontal'
		},
		{
			type:           'html',
			html:           '<b>OR</b>'
		},
		{
			type:           'select',
			id:             'existingFigure',
			items:          items,
			label:          'Select an existing figure',
			labelLayout:    'horizontal'
		},
		{
			type:           'html',
			html:           '<b>OR</b>'
		},
		{
			type:           'button',
			id:             'addNewButton',
			label:          'Add New Figure',
			onClick:        addNewFigure
		}];
		
		var contents = [{
			id:             'figure',
			label:          'Add figure',
			elements:       elements
		}] 
		
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
			existingFigure = dialog.getValueOf('figure', 'existingFigure'),
			replace;
	
		if (existingFigure != '') {
			replace = existingFigure;
		} else if (figureId != '') {
			replace = figureId;
		}
		
		editor.insertText('[figure:' + replace + ']');
	}
	
	function addNewFigure(data) {
		console.log(data);
		$('<div></div>').dialog();
	}
	
	CKEDITOR.dialog.add('figure', function(editor) {
		return figureDialog(editor);
	});
})(jQuery);
