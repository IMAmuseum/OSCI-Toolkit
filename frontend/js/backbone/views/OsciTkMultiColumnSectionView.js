jQuery(function() {
	window.OsciTkMultiColumnSectionView = OsciTkSectionView.extend({
		initialize: function()
		{
			this.dispatcher.on("windowResized", function() {
				console.log("resized");
				this.renderContent();
			}, this);

			OsciTkMultiColumnSectionView.__super__.initialize.call(this);
		},

		renderContent: function()
		{
			console.log("multi-column");

			this.calculateDimensions();

			this.$el.html(this.template(this.model.toJSON()));
		},

		calculateDimensions: function()
		{
			var dimensions = {};

			//get the margins of the section container
			dimensions.sectionMargin = {
				left : parseInt(this.$el.css("margin-left"), 10),
				top : parseInt(this.$el.css("margin-top"), 10),
				right : parseInt(this.$el.css("margin-right"), 10),
				bottom : parseInt(this.$el.css("margin-bottom"), 10)
			};

			//determine the correct height for the section container to eliminate scrolling
			dimensions.sectionHeight = $(window).height() - dimensions.sectionMargin.top - dimensions.sectionMargin.bottom;

			//set the height of the container
			this.$el.height(dimensions.sectionHeight);


		}
	});
});