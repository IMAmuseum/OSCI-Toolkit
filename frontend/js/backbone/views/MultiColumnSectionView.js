// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.MultiColumnSection = OsciTk.views.Section.extend({

		initialize: function() {
			app.dispatcher.on("windowResized", function() {
				console.log("resized");
				this.renderContent();
			}, this);

			this.$el.addClass("oscitk_multi_column");

			//set the default options
			_.defaults(this.options, {
				minColumnWidth : 200,
				maxColumnWidth : 300,
				gutterWidth : 40,
				minLinesPerColumn : 5
			});

			//initialize dimensions object
			this.dimensions = {};

			OsciTk.views.MultiColumnSection.__super__.initialize.call(this);
		},

		renderContent: function() {
			console.log(this.model, "multi-column");

			this.calculateDimensions();
			console.log(this.dimensions, "dimensions");

			//add number of pages to model
			//this.model.set('numPages', 'blah');

			this.layoutComplete = true;

			// this.$el.html(this.template(this.model.toJSON()));
		},

		calculateDimensions: function() {
			var dimensions = this.dimensions;

			//get window height / width
			var windowWidth = $(window).width(),
				windowHeight = $(window).height();

			//if the window size did not change, no need to recalculate dimensions
			if (dimensions.windowWidth && dimensions.windowWidth === windowWidth && dimensions.windowHeight && dimensions.windowHeight === windowHeight) {
				return;
			}

			//cache the window height/width
			dimensions.windowHeight = windowHeight;
			dimensions.windowWidth = windowWidth;

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
			dimensions.outerPageHeight = windowHeight - dimensions.pageMargin.top - dimensions.pageMargin.bottom;
			dimensions.innerPageHeight = dimensions.outerPageHeight - dimensions.pagePadding.top - dimensions.pagePadding.bottom;

			//determine the correct width for the section container
			dimensions.outerPageWidth = this.$el.width();
			dimensions.innerPageWidth = dimensions.outerPageWidth - dimensions.pagePadding.left - dimensions.pagePadding.right;

			//column width
			if (dimensions.innerPageWidth < this.options.maxColumnWidth) {
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
			//set the height of the container
			//dont need this if styled correctly I think
			//this.$el.height(dimensions.pageHeight);
		}
	});
});