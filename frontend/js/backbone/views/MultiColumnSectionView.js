// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.MultiColumnSection = OsciTk.views.Section.extend({

		initialize: function()
		{
			console.log(this.options, 'multi options');

			app.dispatcher.on("windowResized", function() {
				console.log("resized");
				this.renderContent();
			}, this);

			this.$el.addClass("oscitk_multi_column");

			this.options.minColumnWidth = (this.options.minColumnWidth) ? this.options.minColumnWidth : 200;
			this.options.maxColumnWidth = (this.options.maxColumnWidth) ? this.options.maxColumnWidth : 300;
			this.options.gutterWidth = (this.options.gutterWidth) ? this.options.gutterWidth : 40;
			this.options.minLinesPerColumn = (this.options.minLinesPerColumn) ? this.options.minLinesPerColumn : 5;

			OsciTk.views.MultiColumnSection.__super__.initialize.call(this);
		},

		renderContent: function()
		{
			console.log(this.model, "multi-column");

			this.calculateDimensions();

			this.$el.html(this.template(this.model.toJSON()));
		},

		calculateDimensions: function()
		{
			var dimensions = {};

			//copy gutter width out of the options for easy access
			dimensions.gutterWidth = this.options.gutterWidth;

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

			//column width
			if (dimensions.innerPageWidth < this.options.maxColumnWidth)
			{
				dimensions.columnWidth = dimensions.innerPageWidth;
			} else {
				dimensions.columnWidth = this.options.maxColumnWidth;
			}

			//Determine the number of columns per page
			dimensions.columnsPerPage = Math.floor(dimensions.innerPageWidth / dimensions.columnWidth);
			if (dimensions.innerPageWidth < (dimensions.columnsPerPage * dimensions.columnWidth) + ((dimensions.columnsPerPage - 1) * this.options.gutterWidth))
			{
				dimensions.columnsPerPage = dimensions.columnsPerPage - 1;
			}

			//Large gutters look ugly... reset column width if gutters get too big
			var gutterCheck = (dimensions.innerPageWidth - (dimensions.columnsPerPage * dimensions.columnWidth)) / (dimensions.columnsPerPage - 1);
			if (gutterCheck > this.options.gutterWidth) {
				dimensions.columnWidth = (dimensions.innerPageWidth - (this.options.gutterWidth * (dimensions.columnsPerPage - 1))) / dimensions.columnsPerPage;
			}

			this.dimensions = dimensions;
			console.log(dimensions, "dimensions");
			//set the height of the container
			//dont need this if styled correctly
			//this.$el.height(dimensions.pageHeight);
		}
	});
});