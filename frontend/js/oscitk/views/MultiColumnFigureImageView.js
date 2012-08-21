//Add this view to the figure type registry
OsciTk.views.figureTypeRegistry["image_asset"] = "MultiColumnFigureImage";

OsciTk.views.MultiColumnFigureImage = OsciTk.views.MultiColumnFigure.extend({
	renderContent: function() {
		var container = this.$el.find(".figure_content");
		var containerHeight = container.height();
		var containerWidth = container.width();

		container.html(this.model.get('content'));
		container.children("img").css({
			height: containerHeight + "px",
			width: containerWidth + "px"
		});

		this.contentRendered = true;
	},
	fullscreen: function() {
		$.fancybox.open({
			href: $(this.model.get('content')).attr('src')
		});
	}
});