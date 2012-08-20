//Add this view to the figure type registry
OsciTk.views.figureTypeRegistry["layered_image"] = "MultiColumnFigureLayeredImage";

OsciTk.views.MultiColumnFigureLayeredImage = OsciTk.views.MultiColumnFigure.extend({
	initialize: function() {
		this.figContent = null;
		this.contentRendered = false;
	},
	renderContent: function() {
		console.log(this.model, 'model');
		var container = this.$el.find(".figure_content");
		var containerHeight = container.height();
		var containerWidth = container.width();

		// the content document may already be loaded
		if (this.figContent) {
			this.renderFromContentDoc();
		}
		else {
			// get the figure content document from object's data-url attribute
			var figObj = $(this.model.get('content'));
			var figObjUrl = figObj.attr('data-url');
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
		var figureContent = this.$el.find('.figure_content');
		console.log(figureContent, 'figureContent');
		// empty the figure contents
		figureContent.empty();

		// place figure content into container
		figureContent.html(this.figContent);
		
		// spawn Layered Image


		this.contentRendered = true;
	}
});