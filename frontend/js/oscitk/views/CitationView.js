OsciTk.views.Citation = OsciTk.views.BaseView.extend({
	template: OsciTk.templateManager.get('citation'),
	initialize: function() {

		app.dispatcher.on("toggleCiteDialog", function(data) {
			var citationView = this;
			var contentId = data.contentId;
			var content = $('#' + contentId);

			var citationRequestParams = {
				'section_id': app.models.section.get('id'),
				'publication_id': app.models.docPackage.get('id'),
				'element_id': data.contentId
			};

			var colWidth = app.views.sectionView.dimensions.columnWidth;
			var windowWidth = $(window).width();
			var tooltipWidth = colWidth;
			if (colWidth * 1.5 < windowWidth) {
				tooltipWidth = colWidth * 1.5;
			}

			content.qtip("destroy");
			content.qtip({
				content: {
					title: {
						text: "Citation",
						button: "Close"
					},
					text: "Loading...",
					ajax: {
						url: app.config.get('endpoints').OsciTkCitation,
						data: citationRequestParams,
						success: function(data, status) {
							if (data.success) {
								//add reference text to the response
								data.citation.referenceText = content.text();
								data.citation.url = document.URL + "/p-" + app.models.section.get('id') + "-" + content.data('paragraph_number');
								data.citation.paragraphNumber = content.data('paragraph_number');
								data.citation.date = new Date(data.citation.date);
								data.citation.formattedDate = (data.citation.date.getMonth() + 1) + "/" + data.citation.date.getDate() + "/" + data.citation.date.getFullYear();

								//make sure data exists for all variables in templates
								data.citation.creator = data.citation.creator ? data.citation.creator : '';
								data.citation.description = data.citation.description ? data.citation.description : '';
								data.citation.editor = data.citation.editor ? data.citation.editor : '';
								data.citation.publicationTitle = data.citation.publicationTitle ? data.citation.publicationTitle : '';
								data.citation.publisher = data.citation.publisher ? data.citation.publisher : '';
								data.citation.rights = data.citation.rights ? data.citation.rights : '';
								data.citation.title = data.citation.title ? data.citation.title : '';

								//update the display
								this.set('content.text', citationView.template(data.citation));

								this.elements.content.on('click', 'a', function(e) {
									e.preventDefault();
									var $this = $(this);

									var container = $this.parents(".citations");
									container.find('.citation').hide();
									container.find($this.attr('href')).show();

									container.find('li').removeClass('active');
									$this.parent().addClass('active');
								});
							}
						}
					}
				},
				show: {
					event: '',
					ready: true,
					modal: {
						on:true,
						dim: false
					}
				},
				hide: {
					fixed: true,
					event: 'unfocus'
				},
				position: {
					my: 'center',
					at: 'center',
					target: $(document.body)
				},
				style: {
					classes: 'citation-tooltip',
					def: false,
					width: tooltipWidth + 'px'
				},
				events: {
					hide: function(event, api) {
						api.destroy();
					}
				}
			});


		}, this);
	}

});