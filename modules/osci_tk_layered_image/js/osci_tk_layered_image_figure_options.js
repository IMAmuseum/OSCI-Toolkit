var osci_tk_conservation_preview;

(function($) {
	
	osci_tk_conservation_preview = function(nid, optionsInput) {
		var options = JSON.parse(optionsInput.val());
		// we're editing, so mark that in the options
		options.editing = true;
		
		$.ajax({
			url : Drupal.settings.basePath + "conservation/" + nid + "/data.json",
			
			success : function(data) {
				var aspect = data.aspect,
					figureContents = $(data.content).attr("id", "conservation-asset-figure-options"),
					dest = optionsInput.parent();

				// set up new modal dialog
				var modal = $('<div>');
				modal.append('<span class="modal-title">Set Initial Frame</span>');

				// add a figure container with the passed options
				var figureWidth = 600;
				var figureHeight = Math.floor(figureWidth / aspect);
				var figureContainer = $('<figure>');
				figureContainer.attr('data-options', JSON.stringify(options))
					.css({
						margin: '0 auto',
						width: figureWidth + 'px',
						height: figureHeight + 'px'
					})
					.html(figureContents);
				modal.append(figureContainer);

				// options fieldset
				var fieldset = $('<fieldset class="figure_options">').append('<legend>Reader Options</legend>');

				// insert polymap options
				// interaction control
				var interactionContainer = $('<div>');
				var interactionLabel = $('<label>').html('Disable Interaction');
				var interactionToggle = $('<input type="checkbox">')
					.addClass('interaction_toggle');
				if (options.interaction == false) {
					interactionToggle.attr('checked', 'checked');
				}
				interactionContainer.append(interactionToggle).append(interactionLabel);
				fieldset.append(interactionContainer);

				// clear between elements
				fieldset.append($('<div>').addClass('clear').html('&nbsp;'));

				// insert annotation overlay options
				// inset annotation control
				var annotationContainer = $('<div>');
				var annotationLabel = $('<label>').html('Disable Annotation Selection');
				var annotationToggle = $('<input type="checkbox">');
				if (options.annotation == false) {
						annotationToggle.attr('checked', 'checked');
				}
				annotationContainer.append(annotationToggle).append(annotationLabel);
				fieldset.append(annotationContainer);

				// clear between elements
				fieldset.append($('<div>').addClass('clear').html('&nbsp;'));

				// thumbnail
				var thumbContainer = $('<div class="thumbContainer">');
				var thumbLabel = $('<label>').html('Thumbnail Image');
				var thumbFileField = $('<input type="file" id="thumbFileField">');

				thumbContainer.append(thumbLabel).append(thumbFileField);
				if (options.previewUrl) {
					var thumbRemoveContainer = $('<div>');
					var thumbRemove = $('<input type="checkbox" id="thumbRemove" />')
						.appendTo(thumbRemoveContainer)
						.after('<label>Remove Thumbnail</label>');
					var thumbImage = $('<img>')
						.attr('src', options.previewUrl)
						.appendTo(thumbContainer)
						.wrap('<div>');
					thumbContainer.append(thumbRemoveContainer);

					// thumbRemove should disable the file input
					thumbRemove.bind('click', function() {
						var checkbox = $(this);
						if (checkbox.attr('checked')) {
							thumbFileField.attr('disabled', true);
							thumbImage.addClass('image_opaque');
						}
						else {
							thumbFileField.attr('disabled', false);
							thumbImage.removeClass('image_opaque');
						}
					});
				}
				fieldset.append(thumbContainer);

				// add options fieldset to modal
				modal.append(fieldset);

				modal.dialog({
					title: 'Figure Options',
					width: figureWidth + 25,
					modal: true,
					close: function(event, ui) {
						// remove the CA from the global collection
						window.caCollection.remove(jQuery('.conservation-asset', event.target).attr('id'));
						jQuery(this).remove();
					},
					buttons: [
						{ 
							text: 'Cancel', 
							click: function(){ $(this).dialog('close') }
						},
						{ 
							text: 'Restore Defaults',
							click: function() {
								// trigger get_map event on map container 
								$('.conservation-asset', figureContainer).trigger({type: "restore_default_map"});
								$('input', fieldset).removeAttr('checked');
							}
						},
						{
							text: 'Finish', 
							click: function(event) {
								var button = $(event.currentTarget);
								// is the button already locked? 
								var locked = button.attr('data-locked');
								if (locked) {
									return false;
								}
								else {
									// lock the button
									button.attr('data-locked', 1);
									// make the button appear disabled
									button.css('background', '#333');
									button.text('Uploading ...');
								}
								// if a thumbnail was specified, upload it and get back the file path
								// inlcude the path in the options below
								if (thumbFileField.val() != "" && !thumbFileField.attr('disabled')) {
									var reader = new FileReader();
									// declare onload for reader
									reader.onload = function(e) {
										// get the dataURI
										var fileDataURI = e.target.result;
										// send the image to the server
										var post = {
											fileDataURI: fileDataURI,
											figureId: figureId
										};
										$.ajax({
											type: 'POST',
											url: Drupal.settings.baseUrl + "ajax/figurethumb/save",
											data: post,
											success: function(data) {
												// get the current figure options, add or replace the url
												// and resave the options to the dom.
												var data = JSON.parse(data);
												var figureOptions = JSON.parse(dest.siblings('.figure_options:first').val());
												figureOptions.previewUri = data.uri;
												dest.siblings('.figure_options:first').val(JSON.stringify(figureOptions));
												// swap out the original preview image
												var imageElem = dest.find('img:first');
												// force a timestamp here to force reload
												imageElem.attr('src', data.url + "?" + new Date().getTime())
													.css('display', 'block');

												modal.dialog('close');
											}
										});
									};
									// read in the file to activate the onload function
									reader.readAsDataURL(thumbFileField[0].files[0]);
								}

								// alias the figure options map
								var ca = caCollection.find('conservation-asset-figure-options');
								// get extents of map
								var extents = ca.getExtents();
								// set up the new options
								var newOptions = JSON.parse(dest.find('.figure_options:first').val());
								newOptions.swLon 			= extents.swLon;
								newOptions.swLat 			= extents.swLat;
								newOptions.neLon 			= extents.neLon;
								newOptions.neLat 			= extents.neLat;
								newOptions.interaction 		= (!interactionToggle.attr('checked'));
								newOptions.annotation 		= (!annotationToggle.attr('checked'));
								newOptions.annotationPreset	= ca.getVisibleAnnotationIds();
								newOptions.sliderPosition	= ca.getSliderPosition();
								newOptions.baseLayerPreset	= ca.getVisibleBaseLayerIds();
								if (thumbRemove && thumbRemove.attr('checked')) {
									newOptions.previewUri = false;
									dest.find('.preview_image').css('display', 'none');
								}
								newOptions = JSON.stringify(newOptions);

								// inject into hidden form
								var input = $('.figure_options', dest.parents(".fieldset-wrapper:first"));
								input.val(newOptions);
								// update the preview figure
								dest.attr('data-options', newOptions);
								// close the modal
								if (thumbFileField.val() == "" || thumbFileField.attr('disabled')) {
									modal.dialog('close');
								}

								if (dest.find('.figure_warning').length == 0) {
									var warn = $('<div>')
										.addClass('figure_warning')
										.html("Figure Options Set<br>Don't forget to save this node")
										.css({
											'font-size': 'smaller',
											'color' : '#F00'
										});
									warn.prependTo(dest);
								}
							}
						}
					]
				});

				// initialize conservation asset
				new ConservationAsset(figureContents);
			}
		});
	};
	
})(jQuery);