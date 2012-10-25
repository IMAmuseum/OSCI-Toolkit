(function($) {
	
	function getPreviewDiv(id, target) {
		// retrieve options
		var options = $.parseJSON($(target).parents(".fieldset-wrapper:first").find('.figure_options').val());

		// send nid to server to fetch preview
		$.get(Drupal.settings.basePath + 'ajax/figurepreview/' + id,
			function (data) {
				var dest = $(target).parents(".fieldset-wrapper:first").find('.figure_reference_preview');
				dest.html(data.div);
				
				// replace the image with the preview url if it's in the options
				if (options != null && options.previewUrl) {
					dest.find('img:first').attr('src', options.previewUrl);
				}
			},
			"json"
		);
		
	}

    function findReferenceVal(obj) {
        var val = $(obj).val().match(/.+\[(\d+)\]/);
        return val[1];
    }
	
	$(document).ready(function() {
        /**************************************************
         * Figure Preview
         */
		// live events for the figure fields
        $('.figure_reference_field').live({
	        'blur': function(event) {
	        	setTimeout( function() {
                    var parentField = $(event.target).parents('.fieldset-wrapper');
                    var currentNid = findReferenceVal(event.target);
                    var idx = parentField.find('.figure_identifier').data('delta');

                    // Update "asset options" url callback
                    var url = Drupal.settings.basePath + 
                        Drupal.settings.figureAjaxPath +
                        idx + '/' +
                        currentNid;
                    var oldUrl = parentField.find('.form-type-item a').attr('href');
                    parentField.find('a.asset-options').attr('href', url); 

                    // Drupal doesnt like it when we just swap out a link
                    // So we need to update the ajax object so everyone is happy
                    updateAjaxUrl(url, oldUrl);

                    // Update wiki text
                    wikiId = 'fig-' + currentNid + '-' + idx;
                    syntax = '[figure:' + wikiId + ']';
                    parentField.find('.figure_identifier').data('figid', wikiId);
                    parentField.find('.figure_identifier span').html(syntax);

	            	// remove figure options and get new preview
	            	parentField.find('.figure_options').val("");

	            	getPreviewDiv(currentNid, event.target);
	        	}, 500);
	        }
        });
        
        // for the figure reference fields already populated on page load
        $('.figure_reference_field').each(function() {
            nid = findReferenceVal(this);
        	getPreviewDiv(nid, this);
        })
    });

})(jQuery);

function updateAjaxUrl(url, oldUrl) {
    Drupal.ajax[oldUrl].url = url;
    Drupal.ajax[oldUrl].selector = url;
    Drupal.ajax[url] = Drupal.ajax[oldUrl];
    Drupal.ajax[url].options.url = url;
    Drupal.ajax[oldUrl] = null;
}
