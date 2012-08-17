(function($){
	
	$(document).ready(function(){
		$(".fieldset-tabs").tabs();
	});
	
	$(document).ajaxComplete(function(e, xhr, settings){
		if (settings.extraData && settings.extraData._triggering_element_name && settings.extraData._triggering_element_name.indexOf('_add_more') > -1) 
		{
			$(".fieldset-tabs:not(.ui-tabs)").each(function(){
				var $this = $(this);
				$this.tabs();
				var numTabs = $this.tabs("length");
				$this.tabs("select", numTabs - 1);
			});
		}
	});
	
})(jQuery);
