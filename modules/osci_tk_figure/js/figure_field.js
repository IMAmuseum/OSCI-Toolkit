(function($) {

    window.getPreviewDiv = function(id, target) {
        if (id == null) return;
        // retrieve options
        var options = $.parseJSON($(target).parents(".fieldset-wrapper:first").find('.figure_options').val());
        // send nid to server to fetch preview
        $.get(Drupal.settings.basePath + 'ajax/figurepreview/' + id,
            function (data) {
                var container = $(target).parents(".fieldset-wrapper:first");
                var dest = container.find('.figure_reference_preview');

                if (data.show_asset_options) {
                    $(target).parents(".fieldset-wrapper:first").find('.asset-options').show();
                    $(target).parents(".fieldset-wrapper:first").find('.asset-options-reset').show();
                } else {
                    $(target).parents(".fieldset-wrapper:first").find('.asset-options').hide();
                    $(target).parents(".fieldset-wrapper:first").find('.asset-options-reset').hide();
                }

                var thumbData = data.div;
                var customThumb = container.find(".form-managed-file").find("a");
                if (customThumb.length) {
                    thumbData = $("<img/>", {
                        src: customThumb.attr("href")
                    });
                }

                // replace the image with the preview url if it's in the options
                if (data.div !== null) {
                    dest.html(thumbData);
                }
            },
            "json"
        );
    }

    // given a dom text input element, parse out integer from [nid:123] or return whole string
    window.findReferenceVal = function(obj) {
        var val = $(obj).val().match(/.+\[(\d+)\]/);
        if (val !== null) {
            return val[1];
        } else {
            return val;
        }
    }

    $(document).ready(function() {
        // update figure preview image when asset reference field is changed
        $(document).delegate(".figure_reference_field", "blur", function(event) {
            var parentField = $(event.target).parents('.fieldset-wrapper').first();
            var currentNid = findReferenceVal(event.target);
            var idx = parentField.find('.figure_identifier').data('delta');

            // remove figure options and get new preview
            var preview = parentField.find('.preview_image');
            if (preview.length > 0) {
                var previewNid = preview.attr('data-nid');
                if (previewNid != undefined && previewNid != currentNid) {
                    parentField.find('.figure_options').val("");
                }
            }

            getPreviewDiv(currentNid, event.target);
        });
        // remove the figure tab when a figure field instance is removed
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

        $('a.asset-options').click(function(event) {
            var basePath, parentNid, delta, assetNid, figureOptions, ajaxUrl, formLoaded,
                optionsLink = $(this);
            // don't submit form
            event.preventDefault();

            // retrieve asset options form content via ajax
            basePath = Drupal.settings.basePath;
            parentNid = $(this).attr('data-parent-nid');
            delta = $(this).attr('data-delta');
            assetNid = findReferenceVal($(this).parents('.figure-wrapper').find('.figure_reference_field')[0]);
            figureOptions = $(this).parents('.figure-wrapper').find('.figure_options').val() || '{}';
            ajaxUrl = basePath + 'ajax/figure/asset-options/' + parentNid + '/' + delta + '/' + assetNid;
            $.get(ajaxUrl, "options=" + figureOptions, function(data) {
                var modalDiv;
                $.fancybox(data, {
                    hideOnContentClick: false,
                    onComplete: function() {
                        window.renderModal($('#fancybox-content'), optionsLink.parents('.figure-wrapper').find('.figure_options'));
                    }
                });
            });
        });

        $('a.asset-options-reset').click(function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to reset the options for this figure?')) {
                $(this).parents('.figure-wrapper').find('.figure_options').val('{}');
            }
        });
    });
})(jQuery);
