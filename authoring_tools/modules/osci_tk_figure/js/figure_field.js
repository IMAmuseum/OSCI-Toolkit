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
				if (options.previewUrl) {
					dest.find('img:first').attr('src', options.previewUrl);
				}
				
				// build a figure options breakout button if a callback has been specified and declared
				if (data.callback && window[data.callback] && typeof(window[data.callback]) === 'function')
				{
					$('<input>', {
						type : 'button',
						value : 'Figure Options',
						'class' : 'ui-button figure_options_button'
					}).click(function(e){
						e.preventDefault();
						
						var optionsInput = dest.parent().find('input.figure_options');
						
						window[data.callback](data.nid, optionsInput);
					}).appendTo(dest);
				}
			},
			"json"
		);
		
	}
	
	$(document).ready(function() {
        /**************************************************
         * Figure Preview
         */
        $('.figure_reference_field').live({
        	'keyup': function(event) {
	        	// wait a second to see if anything else was pressed
	        	var origVal = event.target.value;
	        	setTimeout(function() {
	        		var currentVal = event.target.value;
	        		if (currentVal == origVal && currentVal != "" && currentVal == parseInt(currentVal)) {
	        			// remove figure options and get new preview
	            		jQuery(event.target).parents('.fieldset-wrapper').find('.figure_options').val("{}");
	            		getPreviewDiv(currentVal, event.target);

	        		}
	        	}, 1250);
        	},
	        'blur': function(event) {
	        	setTimeout( function() {
	        		var currentVal = event.target.value;
	            	if (currentVal == parseInt(currentVal)) {
	            		// remove figure options and get new preview
	            		jQuery(event.target).parents('.fieldset-wrapper').find('.figure_options').val("{}");
	            		getPreviewDiv(currentVal, event.target);
	            	}
	        	}, 500);
	        }
        });
        
    });
	
})(jQuery);