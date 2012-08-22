//Add this view to the figure type registry
OsciTk.views.figureTypeRegistry["layered_image"] = "MultiColumnFigureLayeredImage";

OsciTk.views.MultiColumnFigureLayeredImage = OsciTk.views.MultiColumnFigure.extend({
	// override MultiColumnFigure's events - polymaps handles events for this class
	events: {},
	renderContent: function() {
		this.figContent = this.figContent || null;
		var container = this.$el.find(".figure_content");
		var containerHeight = container.height();
		var containerWidth = container.width();

		// place figure options on figure tag
		var jsonOptions = JSON.stringify(this.model.get('options'));
		this.$el.attr('data-options', jsonOptions);

		// the content document may already be loaded
		if (this.figContent !== null) {
			this.renderFromContentDoc();
		}
		else {
			// get the figure content document from object's data-url attribute
			var figObj = $(this.model.get('content'));
			var figObjUrl = figObj.attr('data');
			if (figObjUrl !== undefined) {
				var $this = this;
				$.ajax({
					url: figObjUrl,
					type: 'GET',
					dataType: 'html',
					success: function(data) {
						$this.figContent = $(data).filter('.layered_image-asset').first();
						$this.renderFromContentDoc();
					}
				});
			}
		}
	},
	renderFromContentDoc: function() {
		var contentDiv = this.$el.find('.figure_content');
		contentDiv.empty();
		// place figure content into container and spawn Layered Image
		contentDiv.html(this.figContent);
		new window.LayeredImage(contentDiv.find('.layered_image-asset')[0]);
		this.contentRendered = true;
	}
});