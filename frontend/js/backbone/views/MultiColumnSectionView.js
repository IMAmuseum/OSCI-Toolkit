// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.MultiColumnSection = OsciTk.views.Section.extend({

		initialize: function() {
			this.options.pageView = 'MultiColumnPage';

			app.dispatcher.on("windowResized", function() {
				this.removeAllChildViews();
				this.model.removeAllPages();
				this.render();
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
			//add the template to the page
			this.$el.html(this.template());

			this.calculateDimensions();

			//setup location to store layout housekeeping information
			this.layoutData = {
				data : this.model.get('content'),
				items : null
			};

			//remove unwanted sections & parse sections
			this.cleanData();

			this.layoutData.items = this.layoutData.data.length;

			var i = 0;
			while(this.layoutData.items > 0) {
				var pageView = this.getPageForProcessing();

				if (!pageView.processingData.rendered) {
					pageView.render();
				}

				var overflow = pageView.addContent($(this.layoutData.data[i]).clone()).layoutContent();

				if (!overflow) {
					i++;
					this.layoutData.items--;
				}
			}
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
			dimensions.outerPageWidth = this.$el.outerWidth();
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
		},

		cleanData: function() {
			//remove the figure section
			this.layoutData.data.find("#figures").remove();

			//remove the footnotes section
			this.layoutData.data.find("#footnotes").remove();

			//remove any inline figures and replace with references
			var inlineFigures = this.layoutData.data.find("figure");
			if (inlineFigures.length) {
				var figureRefTemplate = _.template($('#template-figure-reference').html());

				for(var i = 0, len = inlineFigures.length; i < len; i++) {
					var figure = $(inlineFigures[i]);
					var figureData = {
						id : figure.attr("id"),
						title : figure.attr("title")
					};

					figure.replaceWith(figureRefTemplate(figureData));
				}
			}

			//chunk the data into managable parts
			this.layoutData.data = this.layoutData.data.find('section').children();
		}
	});
});