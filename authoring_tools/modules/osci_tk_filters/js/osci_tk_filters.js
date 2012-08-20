(function ($) {
    /**************************************************
     * CKEditor Paste from word and create footnotes
     */

	window.osci_tk_new_footnotes = null;

    if (typeof(CKEDITOR) === 'undefined')
	{
		return;
	}

	if (!CKEDITOR.cleanWord) {
		CKEDITOR.scriptLoader.load(CKEDITOR.basePath + 'plugins/pastefromword/filter/default.js');
	}

	$('document').ready(function(){
		$(this).ajaxComplete(function(e, xhr, settings) {
			if (settings && settings.extraData && settings.extraData._triggering_element_name && settings.extraData._triggering_element_name == 'field_footnote_add_more')
			{
				var numFootnotes = window.osci_tk_new_footnotes ? window.osci_tk_new_footnotes.length : 0;
				if (numFootnotes)
				{
					var footnoteContainers = $(".field-name-field-footnote").find(".fieldset-tab-content"),
						updateContainerNum = footnoteContainers.length;

					for (var i = numFootnotes - 1; i >= 0; i--)
					{
						updateContainerNum--;
						var updateId = $(footnoteContainers[updateContainerNum]).find("textarea").attr("id");
						CKEDITOR.instances[updateId].setData(window.osci_tk_new_footnotes[i].content);
					}

					window.osci_tk_new_footnotes = null;
				}

				$("[name='field_footnote[und][num_add]']").val(1);
			}
		});
	});

	CKEDITOR.on('instanceCreated', function(e)
	{
		e.editor.on("paste", function(event)
		{
			//  replace footnotes with data
			var data = $('<span>' + event.data.html + '</span>'),
				footnotes = [];

			var nextDelta = parseInt($(".field-name-field-footnote").find(".ui-tabs-nav").find("a:last").text(), 10) + 1;
			nextDelta = nextDelta ? nextDelta : 0;

			// Search for footnote links in body text
			data.find('a').each(function(idx, val) {
				var $this = $(this),
					$val = $(val),
					name = $this.attr('name');

				if (name.indexOf('_ftnref') === 0 || name.indexOf('_ednref') === 0)
				{
					var footnote = name.replace('ref', ''),
						content  = data.find('#' + footnote.replace('_', ''));

					content.find("a").remove();
					content = content.text();
					if (content !== null)
					{
						content = CKEDITOR.cleanWord(content, event.editor);
					}

					$val.replaceWith('[footnoteref:fn-' + Drupal.settings.osci_tk_filters.current_nid + '-' + nextDelta + ']');

					data.find('#' + footnote.replace('_', '')).remove();
					footnotes.push({
						footnoteId : footnote,
						content : content
					});

					nextDelta++;
				}
				else
				{
					$(this).next().html('');
					$(this).html('');
				}
			});

			var numFootnotes = footnotes.length;
			if (numFootnotes)
			{
				$("[name='field_footnote[und][num_add]']").val(numFootnotes);
				window.osci_tk_new_footnotes = footnotes;

				var addAnother = $(".field-name-field-footnote").find("input.field-add-more-submit");
				addAnother.trigger("mousedown");

			}

			event.data.html = data.html();
		});
	});

    CKEDITOR.timestamp = ( new Date() ).valueOf();

})(jQuery);