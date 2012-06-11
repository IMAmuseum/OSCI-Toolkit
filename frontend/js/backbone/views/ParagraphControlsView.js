// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.ParagraphControlsView = OsciTk.views.BaseView.extend({
	className: 'paragraph-controls',
	contentIdentifier: null,
	paragraphNumber: null,
	content: null,
	
	initialize: function(params) {
		this.content = params.content;
		this.paragraphNumber = this.content.data("paragraph_number");
		this.contentIdentifier = this.content.data("osci_content_id");
		this.render();
	},
	
	render: function() {
		var contentPosition = this.content.position();

		this.$el.attr('data-osci_content_id', this.contentIdentifier);
		this.$el.attr('data-paragraph_identifier', this.paragraphNumber);
		this.$el.html('<span class="paragraph-identifier paragraph-identifier-' + this.paragraphNumber + '">' 
			+ this.paragraphNumber + '</span>');
		this.$el.css({
			top: contentPosition.top + 'px',
			left: (contentPosition.left - app.views.sectionView.dimensions.gutterWidth) + "px"
		});
		this.content.before(this.$el);
//		var pid = $("<div>", {
//			"class": "paragraph-controls",
//			"data-osci_content_id": contentIdentifier,
//			"data-paragraph_identifier": paragraphNumber,
//			
//			html: "<span class=\"paragraph-identifier paragraph-identifier-" + paragraphNumber + "\">" + paragraphNumber + "</span>",
//			css: {
//				top: (columnPosition.top + contentPosition.top) + "px",
//				left: (columnPosition.left + contentPosition.left - this.parent.dimensions.gutterWidth) + "px"
//			}
//		}).appendTo(this.$el);
	}
});