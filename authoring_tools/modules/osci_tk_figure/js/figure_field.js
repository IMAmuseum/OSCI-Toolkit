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
	
	$(document).ready(function() {
        /**************************************************
         * Figure Preview
         */
		// live events for the figure fields
        $('.figure_reference_field').live({
	        'change': function(event) {
	        	setTimeout( function() {
	        		var currentVal = event.target.value.match(/.+\[(\d+)\]/);
                    currentVal = currentVal[1];
	            	if (currentVal == parseInt(currentVal, 10)) {
	            		// remove figure options and get new preview
                        var parentField = $(event.target).parents('.fieldset-wrapper');
	            		parentField.find('.figure_options').val("");

                        // Update the options callback
                        var idx = parentField.find('.figure_identifier').data('delta');
                        var href = Drupal.settings.basePath + Drupal.settings.figureAjaxPath + idx + '/' + currentVal;
                        parentField.find('a.asset-options').attr('href', href);

	            		getPreviewDiv(currentVal, event.target);
	            	}
	        	}, 500);
	        }
        });
        
        // for the figure reference fields already populated on page load
        $('.figure_reference_field').each(function() {
        	var nid = $(this).val().match(/.+\[(\d+)\]/);
        	getPreviewDiv(nid[1], this);
        })
    });
	
})(jQuery);
