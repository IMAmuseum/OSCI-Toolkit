(function($) {
	$(document).delegate(".remove-footnote", "click", function(e) {
		e.preventDefault();
		var $this = $(this);

		var tabs = $this.parent().siblings(".fieldset-tabs");
		var currentTab = tabs.tabs( "option", "selected" );

		//remove the asset reference so drupal will remove on save
		$("#edit-field-footnote-und-" + currentTab + "-value").val("").html("");

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