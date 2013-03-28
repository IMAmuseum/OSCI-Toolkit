(function($) {

	function getPreviewDiv(id, target) {
        if (id == null) return;

		// retrieve options
		var options = $.parseJSON($(target).parents(".fieldset-wrapper:first").find('.figure_options').val());

		// send nid to server to fetch preview
		$.get(Drupal.settings.basePath + 'ajax/figurepreview/' + id,
			function (data) {
				var dest = $(target).parents(".fieldset-wrapper:first").find('.figure_reference_preview');

                if (data.show_asset_options) {
                    $(target).parents(".fieldset-wrapper:first").find('.asset-options').show();
                } else {
                    $(target).parents(".fieldset-wrapper:first").find('.asset-options').hide();
                }

				// replace the image with the preview url if it's in the options
				if (options !== null && options.previewUrl) {
					dest.find('img:first').attr('src', options.previewUrl);
                }
			},
			"json"
		);

	}

	function findReferenceVal(obj) {
		var val = $(obj).val().match(/.+\[(\d+)\]/);
		if (val !== null) {
			return val[1];
		} else {
			return val;
		}
	}

	$(document).ready(function() {
		/**************************************************
		 * Figure Preview
		 */
		$(document).delegate(".figure_reference_field", "blur", function(event) {
			setTimeout( function() {
				var parentField = $(event.target).parents('.fieldset-wrapper');
				var currentNid = findReferenceVal(event.target);
				var idx = parentField.find('.figure_identifier').data('delta');

				// Update "asset options" url callback
				var url = Drupal.settings.basePath +
					Drupal.settings.figureAjaxPath +
					idx + '/' +
					currentNid +
                    '?options=' +
                    $('[name="field_figure[und][' + idx + '][options]"]').val();
				var oldUrl = parentField.find('.form-type-item a').attr('href');
				parentField.find('a.asset-options').attr('href', url);

				// Drupal doesnt like it when we just swap out a link
				// So we need to update the ajax object so everyone is happy
                updateAjaxUrl(url, oldUrl);

				// remove figure options and get new preview
				parentField.find('.figure_options').val("");

				getPreviewDiv(currentNid, event.target);
			}, 500);
		});

		$(document).delegate(".remove-figure", "click", function(e) {
			e.preventDefault();
			var $this = $(this);

			var tabs = $this.parent().siblings(".fieldset-tabs");
			var currentTab = tabs.tabs( "option", "selected" );

			//remove the asset reference so drupal will remove on save
			$('#edit-field-figure-und-' + currentTab).find(".figure_reference_field").val("");

			//disable the tab
			var numTabs = tabs.tabs("length");
			if (currentTab < (numTabs - 1)) {
				tabs.tabs("select", currentTab + 1);
			} else {
				tabs.tabs("select", currentTab - 1);
			}

			tabs.tabs("disable", currentTab);
		});

	});

    Drupal.behaviors.osciFigures = {
        attach: function() {
            $('.asset-options').hide();
            // for the figure reference fields already populated on page load
            $('.figure_reference_field').each(function() {
                var nid = findReferenceVal(this);
                if (nid !== null) {
                    getPreviewDiv(nid, this);
                }   
            }); 
        }
    }


})(jQuery);

var updateAjaxUrl = function(url, oldUrl) {
    Drupal.ajax[oldUrl].url = url;
    Drupal.ajax[oldUrl].selector = url;
    Drupal.ajax[url] = Drupal.ajax[oldUrl];
    Drupal.ajax[url].options.url = url;
    Drupal.ajax[oldUrl] = null;
} 
