(function($)
{
    if (!$.osci) {
        $.osci = {};
    }

    $.osci.note = function(options)
    {
        var base = this.note;
        base.activeParagraph = 0;
        base.toolbar = undefined;
        base.selection = '';
        
        base.init = function()
        {
            base.options = $.extend({}, $.osci.note.defaultOptions, options);
            base.panel = $("#" + base.options.notePanelId);
            var noteLinkMarkup = '{{if body}}<div id="note-link-${onid}" data-onid=${onid} data-pid="${paragraph_id}" class="noteTitle">' +
                '<a class="use-ajax" href="' + Drupal.settings.basePath + 'ajax/note/load/${onid}">${body}</a>' +
                '</div>{{/if}}';
            $.template('noteLink', noteLinkMarkup);

            // APA Style
            var citationAPA = '1. ${author}. (${pubDate}). ${articleTitle} In ${bookTitle} (${publisher}) para: ${paragraph}';
            $.template('citationAPA', citationAPA);

            // MLA Style
            var citationMLA = '{{if author}}${author}, {{/if}}"<em>${articleTitle}</em>: ${subSection}," in <span style="text-decoration:underline;">${bookTitle}</span>, ed. ${editor} (${publisher}, ${pubDate}), ${paragraph}.';
            $.template('citationMLA', citationMLA);

            // Chicago style
            var citationChicago = '${author}. ${pubDate} ${articleTitle}. In <em>${bookTitle}</em>, ${paragraph}. ${publisher}';
            $.template('citationChicago', citationChicago);

            var citationTemplate = '{{if author}}${author}, {{/if}}"<em>${articleTitle}</em>: ${subSection}," in <em>${bookTitle}</em>, ed. ${editor} (${publisher}, ${pubDate}), para ${paragraph}.';
            $.template('citationTemplate', citationTemplate);

            amplify.subscribe("osci_navigation_complete", function(data) {
                base.updatePageNotes(data.page);
            });
            
            // Hide toolbar on load
            if (!base.toolbar) {
                base.toolbar = $('ul.selection-toolbar').appendTo($("body")).hide();
                //base.toolbar.css('display', 'inline');
                
                // Cleanup Toolbar
                base.toolbar.find("a").click(function(e) {
                    e.preventDefault();
                    base.toolbar.hide();
                });
            }
            
            $(window).click(function(e){
            	if (!$(e.target).is('p')) {
            		if (base.toolbar.is(':visible')) {
            			base.toolbar.hide();
            		}
            	}
            });
            
            $('.noteTitle').live('hover', function(e) {
//                    var onid = $(this).data('onid');
//                    if (e.type == 'mouseenter') {
//                        $('span.note-' + onid).addClass('highlight-note');
//                    } else {
//                        $('span.note-' + onid).removeClass('highlight-note');
//                    }
                var pid = $(this).data('pid');
                if (e.type == 'mouseenter') {
                    $('a.osci_paragraph_' + pid).addClass('cite-paragraph');
                    $('p.osci_paragraph_' + pid).addClass('highlight-note');
                } else {
                    $('a.osci_paragraph_' + pid).removeClass('cite-paragraph');
                    $('p.osci_paragraph_' + pid).removeClass('highlight-note');
                }
            });
            
            /**
             * Update form fields when submitting a note
             */
            $(document).bind('CToolsAttachBehaviors', function(e, modal) {
                var id = $(modal).find('form').attr('id');
                switch(id) {
                    case 'note-form':
                        $("input[name='nid']").val($.osci.navigation.data.nid);
                        $("input[name='selection']").val($.osci.note.selection.selection);
                        $("input[name='end_node']").val($.osci.note.selection.end_node);
                        $("input[name='end_offset']").val($.osci.note.selection.end_offset);
                        $("input[name='paragraph_id']").val($.osci.note.selection.paragraph_id);
                        $("input[name='parent_offset']").val($.osci.note.selection.parent_offset);
                        $("input[name='start_node']").val($.osci.note.selection.start_node);
                        $("input[name='start_offset']").val($.osci.note.selection.start_offset);
                        break;
                    case 'citation-form':
                        var data = {
                            author: base.selection.publicationInfo.author,
                            pubDate: base.selection.publicationInfo.timestamp.getUTCFullYear(),
                            subSection: base.selection.publicationInfo.sub_section_title,
                            bookTitle: $("<div>" + base.selection.publicationInfo.volume_title + "</div>").text().replace(/(\r\n|\n|\r)/gm,""),
                            publisher: 'Chicago: Art Institute of Chicago',
                            articleTitle: $("<div>" + base.selection.publicationInfo.section_title + "</div>").text().replace(/(\r\n|\n|\r)/gm,""),
                            paragraph: base.selection.paragraph_id,
                            editor: base.selection.publicationInfo.editor
                        };
                        
                        $('a[href$="#citation-format-default"]').click(function(e) {
                            e.preventDefault();
                            $('#citation_text').html($.tmpl('citationTemplate', data));
                            $('#edit-citation-options ul li').removeClass('active');
                            $(this).parent().addClass('active');
                        });

                        $('a[href$="#citation-format-default"]').click(); //default

//                        $('a[href$="#citation-format-apa"]').click(function(e) {
//                            e.preventDefault();
//                            $('#edit-citation-text').html($.tmpl('citationApa', data));
//                            $('#edit-citation-options ul li').removeClass('active');
//                            $(this).parent().addClass('active');
//                        });
//
//                        $('a[href$="#citation-format-apa"]').click(); //default
//
                        $('a[href$="#citation-format-mla"]').click(function(e) {
                            e.preventDefault();
                            $('#citation_text').html($.tmpl('citationMLA', data));
                            $('#edit-citation-options ul li').removeClass('active');
                            $(this).parent().addClass('active');
                        });
//
//                        $('a[href$="#citation-format-chicago"]').click(function(e) {
//                            e.preventDefault();
//                            $('#edit-citation-text').html($.tmpl('citationChicago', data));
//                            $('#edit-citation-options ul li').removeClass('active');
//                            $(this).parent().addClass('active');
//                        });

                        $('#citation_paragraph_text').html($("p.osci_paragraph_" + base.selection.paragraph_id + ":first").text());
                        $('#edit-citation-url').val($('a.osci_paragraph_' + base.selection.paragraph_id).attr('href'));
                        $('#edit-citation-text, #edit-citation-url, #edit-citation-selection').click(function(e) {
                            e.preventDefault();
                            $(this).select();
                        });

                        break;
                }

                /**
                 * Prevent pagination when modal is open
                 */
                $('#modalContent').keydown(function(e) {
                    e.stopPropagation();
                });
            });
            
            /*************************************
             * handle note dialog
             */

            $('.note-close-link').live('click', function(e) {
                e.preventDefault();
                $(this).parents('.note').remove();
            });

            amplify.subscribe("osci_layout_complete", function() {
                $('#osci_viewer').find('.osci_paragraph').click(function(e){

                    if (e.target.nodeName == "A") {
                        return;
                    }

                    // e.stopPropagation();
//                    $.osci.note.toolbar.appendTo($('body'));
                    var left    = e.clientX - (base.toolbar.outerWidth() / 2);
                    var top     = e.clientY - base.toolbar.outerHeight() - parseInt($('.osci_paragraph').css('lineHeight'));
//                    base.toolbar.css('left', left);
//                    base.toolbar.css('top', top);
                    base.toolbar.css({
                        'left' : left,
                        'top' : top
                    }).show();

                    var target = $(e.currentTarget);
                    if (target.is("p")) {
                        var classes = target.attr('class').split(' '),
                            field;
                            
                        for (var i = 0; i < classes.length; i++) {
                            var matches = /^field\_(.+)/.exec(classes[i]);
                            if (matches != null) {
                               field = matches[0];
                            }
                        }
                        
                        var tocData = $.osci.navigation.getPublicationInfo(
                            $.osci.navigation.data.nid,
                            field
                        );

                        base.selection = {
                            selection:      null,
                            start_node:     null,
                            start_offset:   null,
                            end_node:       null,
                            end_offset:     null,
                            parent_offset:  null,
                            paragraph_id:   target.data('paragraph_id'),
                            publicationInfo:tocData
                        }
                    }
                });


                /**
                * Handle text highlighting
                */
//                $('#osci_viewer .osci_paragraph').highlight({
//                    onSelection: function(obj, e, properties) {
//                        $.osci.note.toolbar.appendTo($('body'));
//                        $.osci.note.selection = properties;
//
//                        var left    = e.clientX - ($.osci.note.toolbar.outerWidth() / 2);
//                        var top     = e.clientY - $.osci.note.toolbar.outerHeight() - parseInt($('.osci_paragraph').css('lineHeight'));
//                        $.osci.note.toolbar.css('left', left);
//                        $.osci.note.toolbar.css('top', top); 
//
//                        $('a.note-highlight').unbind('click');
//                        $('a.note-highlight').click(function(e) {
//                            e.preventDefault();
//                            e.stopPropagation();
//
//                            properties.nid = $.osci.navigation.data.nid;
//
//                            $.ajax({
//                                type: 'post',
//                                dataType: 'json',
//                                url: base.options.noteSaveCallback,
//                                data: properties,
//                                success: function() {
//                                    base.addNotes();
//                                }
//                            });
//                        });
//
//                        // Cleanup Toolbar
//                        $('ul.selection-toolbar a').click(function() {
//                            $.osci.note.toolbar.detach();
//                        });
//
//                    },
//                    onEmptySelection: function() {
//                        $.osci.note.toolbar.detach();
//                    }
//                });


                base.addNotes();

                /************************************************
                 * Highlight/Note hover handling
                 */

//                $('span.highlight').live('hover', function(e) {
//                    var onid = $(this).data('onid');
//                    if (e.type == 'mouseenter') {
//                        $('.note-close-link').click();
//                        $('#note-link-' + onid + ' a').css({ opacity: 1 });
//                        $('span.note-' + onid).addClass('highlight-note');
//                    } else {
//                        $('#note-link-' + onid + ' a').css({ opacity: 0.5 });
//                        $('span.note-' + onid).removeClass('highlight-note');
//                    }
//                });

//                $('p').delegate('span.highlight-note', 'click', function() {
//                    var onid = $(this).data('onid');
//                    $('#note-link-' + onid + ' a').click();
//                });

//                $('p').delegate('span.highlight', 'click', function(e) {
//                    /*
//                    $(this).toggleClass('highlight-note');
//                    var onid = $(this).data('onid');
//                    var link = '<a href="' + Drupal.settings.basePath + 'ajax/note/delete/' + onid +'" class="note-delete-link use-ajax">Delete</a>';
//                    $(this).prepend(link);
//                    Drupal.detachBehaviors();
//                    Drupal.attachBehaviors();
//                    */
//                });

                /**
                 * Paragraph hover styles
                 */
                $('#osci_viewer').find('p.osci_paragraph').hover(
                    function() {
                        var id = $(this).data('paragraph_id');
                        $('a.osci_paragraph_' + id).addClass('cite-paragraph');
                        $('p.osci_paragraph_' + id).addClass('cite-paragraph');
                        $('.noteTitle[data-pid=' + id + ']').addClass("hover");
                    },
                    function() {
                        var id = $(this).data('paragraph_id');
                        $('a.osci_paragraph_' + id).removeClass('cite-paragraph');
                        $('p.osci_paragraph_' + id).removeClass('cite-paragraph');
                        $('.noteTitle[data-pid=' + id + ']').removeClass("hover");
                    }
                );


//                $('.highlight .note-delete-link').live('click', function(e) {
//                    e.preventDefault();
//                    $(this).remove();
//                });

            });
            
            amplify.subscribe("osci_note_toggle", function(data) {
                if (!data) {
                    data = {};
                }
                
                if ((base.panel.hasClass("open") && !data.osci_note_open) || data.osci_note_close) {
                    if ($.browser.msie) {
                        base.panel.attr("style", "-ms-transform:translate(" + (base.panel.outerWidth() - base.options.panelPixelsClosed) + "px, 0);");
                    } else {
                        base.panel.css({
                            "-webkit-transform" : "translate(" + (base.panel.outerWidth() - base.options.panelPixelsClosed) + "px, 0)",
                            "-moz-transform" : "translate(" + (base.panel.outerWidth() - base.options.panelPixelsClosed) + "px, 0)",
                            "transform" : "translate(" + (base.panel.outerWidth() - base.options.panelPixelsClosed) + "px, 0)"
                        });
                    }
                    
                    base.panel.removeClass("open");
                } else {
                    if ($.browser.msie) {
                        base.panel.attr("style", "-ms-transform:translate(0,0);");
                    } else {
                        base.panel.css({
                            "-webkit-transform" : "translate(0px, 0)",
                            "-moz-transform" : "translate(0px, 0)",
                            "transform" : "translate(0px, 0)"
                        });
                    }

                    base.panel.addClass("open");
                }
            });
            base.panel.addClass("open");
        };
        
        base.addNotes = function() {
            $('.noteTitle').remove();
            
            $.ajax({
                url: base.options.userNoteCallback + '/' + $.osci.navigation.data.nid,
                dataType: 'json',
                success: function(data) {
                    if (data == null) {
                        return;
                    }
                    
                    base.processNotes(data);
                
//                    $('.highlight, .highlight-temp').each(function() {
//                        $(this).replaceWith($(this).text());
//                    });
//
//                    for (var i = 0; i < data.length; i++) {
//                        var activeParagraph = $('p.osci_paragraph_' + data[i].paragraph_id);
//                        $.highlighter.highlight(activeParagraph, data[i]);
//                    }
//
//                    $('.highlight-temp').addClass('highlight');
//                    $('.highlight-temp').removeClass('highlight-temp');

                    base.updatePageNotes($.osci.navigation.data.currentPage);

                }
            });
        }

        base.processNotes = function(data) {
            if (data == null) {
                return;
            }

            $.tmpl('noteLink', data).appendTo(base.panel).hide();

            Drupal.detachBehaviors();
            Drupal.attachBehaviors();
        }

        base.updatePageNotes = function(page) {
            var notes = $('.noteTitle').hide(),
                numNotes = notes.length,
                $page = $('.osci_page_' + page);
            
            for (var i = 0; i < numNotes; i++) {
                var note = $(notes[i]);
                var p = $page.find("p.osci_paragraph_" + note.data("pid"));
                if (p.length) {
                    $('#note-link-' + note.data("onid")).show();
                    p.addClass("has_note");
                    $page.find("a.osci_paragraph_" + note.data("pid")).addClass("has_note");
                }
            }
//            $('.osci_page_' + page).find('.highlight').each(function() {
//                var pageHeight = $(this).parents('.osci_page').height();
//                // The highlight needs to be in the viewable plain, and the parent should be a paragraph
//                if ($(this).position().top >= 0 && $(this).position().top < pageHeight && $(this).parent().hasClass('osci_paragraph')) {
//                    var onid = $(this).data('onid');
//                    $('#note-link-' + onid).show();
//                }
//            });
        }

        base.init();
    };

    $.osci.note.defaultOptions = {
        notePanelId : "osci_note_panel_wrapper",
        panelPixelsClosed : 20,
        userNoteCallback : '/ajax/note',
        noteSaveCallback : '/ajax/note/save'
    };
})(jQuery);