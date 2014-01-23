(function($){
    $(document).ready(function(){
        $(".fieldset-tabs").tabs({
            // trigger figure preview when a tab is selected
            select: function(event, ui) {
                // ensure this is a figure tab
                if (ui.panel.id.indexOf("figure") > 0) {
                    // get reference field and asset nid
                    var referenceField = $(ui.panel).find('.figure_reference_field');
                    var nid = findReferenceVal(referenceField)
                    // fire preview
                    if (parseInt(nid, 10) > 0) {
                        getPreviewDiv(nid, referenceField);
                    }
                }
            }
        });
        // grab the preview for the first tab
        var referenceField = $('#edit-field-figure-und-0-asset-reference');
        if (referenceField.length > 0) {
            var nid = findReferenceVal(referenceField);
            if (parseInt(nid, 10) > 0) {
                getPreviewDiv(nid, referenceField);
            }
        }
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
