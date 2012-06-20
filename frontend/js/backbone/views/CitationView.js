// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

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
								//TODO: create proper url
								data.citation.url = "http://test";
								data.citation.paragraphNumber = content.data('paragraph_number') + 1;
								data.citation.date = new Date(data.citation.date);
								data.citation.formattedDate = (data.citation.date.getMonth() + 1) + "/" + data.citation.date.getDate() + "/" + data.citation.date.getFullYear();

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
					width: app.views.sectionView.dimensions.columnWidth + 'px'
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