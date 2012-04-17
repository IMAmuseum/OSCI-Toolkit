// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	window.OsciTkMultiColumnSectionView = OsciTk.views.Section.extend({
		defaults: {
			minColumnWidth : 200,
			maxColumnWidth : 300,
			gutterWidth : 40,
			minLinesPerColumn : 5
		},

		initialize: function()
		{
			console.log(this.options, 'multi options');

			app.dispatcher.on("windowResized", function() {
				console.log("resized");
				this.renderContent();
			}, this);

			this.$el.addClass("oscitk_multi_column");

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
			dimensions.pageMargin = {
				left : parseInt(this.$el.css("margin-left"), 10),
				top : parseInt(this.$el.css("margin-top"), 10),
				right : parseInt(this.$el.css("margin-right"), 10),
				bottom : parseInt(this.$el.css("margin-bottom"), 10)
			};

			//get the padding of the section container
			dimensions.pagePadding = {
				left : parseInt(this.$el.css("padding-left"), 10),
				top : parseInt(this.$el.css("padding-top"), 10),
				right : parseInt(this.$el.css("padding-right"), 10),
				bottom : parseInt(this.$el.css("padding-bottom"), 10)
			};

			//determine the correct height for the section container to eliminate scrolling
			dimensions.outerPageHeight = $(window).height() - dimensions.pageMargin.top - dimensions.pageMargin.bottom;
			dimensions.innerPageHeight = dimensions.outerPageHeight - dimensions.pagePadding.top - dimensions.pagePadding.bottom;

			//determine the correct width for the section container
			dimensions.outerPageWidth = this.$el.width();
			dimensions.innerPageWidth = dimensions.outerPageWidth - dimensions.pagePadding.left - dimensions.pagePadding.right;

			//column count

			//column width
			// if (dimensions.innerPageWidth < this.get('maxColumnWidth')) {
			// 	dimensions.columnWidth = dimensions.innerPageWidth;
			// } else {
			// 	dimensions.columnWidth = this.get('maxColumnWidth');
			// }

			//page count



			console.log(dimensions, 'dimensions');

			//set the height of the container
			this.$el.height(dimensions.pageHeight);
		}
	});
});