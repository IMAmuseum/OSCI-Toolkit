(function($) {
	$(document).delegate(".remove-footnote", "click", function(e) {
		e.preventDefault();
		var $this = $(this);

		var tabs = $this.parent().siblings(".fieldset-tabs");
		var currentTab = tabs.tabs( "option", "selected" );
        var fieldId = "edit-field-footnote-und-" + currentTab + "-value";

		//remove the asset reference so drupal will remove on save
		$("#" + fieldId).val("").html("");

        if (CKEDITOR !== undefined && CKEDITOR.instances[fieldId]) {
            CKEDITOR.instances[fieldId].setData('');
        }

		//disable the tab
		var numTabs = tabs.tabs("length");
		if (currentTab < (numTabs - 1)) {
			tabs.tabs("select", currentTab + 1);
		} else {
			tabs.tabs("select", currentTab - 1);
		}

		tabs.tabs("disable", currentTab);
	});
})(jQuery);
