// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //


OsciTk.views.MultiColumnSection = OsciTk.views.Section.extend({

	template: OsciTk.templateManager.get('multi-column-section'),

	initialize: function() {
		this.options.pageView = 'MultiColumnPage';

		app.dispatcher.on("windowResized", function() {
			this.removeAllChildViews();
			this.model.removeAllPages();
			this.render();
		}, this);

		app.dispatcher.on("navigate", function(data) {
			var gotoPage = 1;
			if (data.page) {
				gotoPage = data.page;
			}
			else if (data.figure) {
				// TODO: handle navigation to a figure
				console.log('navigate to figure', data.figure);
			}
			else if (data.identifier) {
				switch (data.identifier) {
					case 'end':
						gotoPage = this.model.get('pages').length;
						break;
					default:
						//TODO: make this work for an identifier
						gotoPage = 1;
						break;
				}
			}

			//make the view visible
			this.getChildViewByIndex(gotoPage - 1).show();

			//calculate the page offset to move the page into view
			var offset = (gotoPage - 1) * (this.dimensions.innerSectionHeight) * -1;

			//TODO: add step to hide all other pages
			var pages = this.getChildViews();
			var numPages = pages.length;
			for(var i = 0; i < numPages; i++) {
				if (i !== (gotoPage - 1)) {
					pages[i].hide();
				}
			}

			//move all the pages to the proper offset
			this.$el.find("#pages").css("-webkit-transform", "translate3d(0, " + offset + "px, 0)");

			//trigger event so other elements can update with current page
			app.dispatcher.trigger("pageChanged", {page: gotoPage});

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
		this.$el.html(this.template());

		this.calculateDimensions();

		//setup location to store layout housekeeping information
		this.layoutData = {
			data : this.model.get('content'),
			items : null
		};

		//remove unwanted sections & parse sections
		this.cleanData();

		//create a placeholder for figures that do not fit on a page
		this.unplacedFigures = [];

		this.layoutData.items = this.layoutData.data.length;

		var i = 0;
		var firstOccurence = true;
		var itemsOnPage = 0;
		while(this.layoutData.items > 0) {
			var pageView = this.getPageForProcessing(undefined, "#pages");

			if (!pageView.processingData.rendered) {
				itemsOnPage = 0;
				pageView.render();
			}

			var content = $(this.layoutData.data[i]).clone();
			if (firstOccurence) {
				content.attr('id', 'osci-content-' + i);
			}

			var layoutResults = pageView.addContent(content).layoutContent();

			switch (layoutResults) {
				case 'contentOverflow':
					firstOccurence = false;
					break;
				case 'figurePlaced':
					pageView.resetPage();
					this.layoutData.items += itemsOnPage;
					i -= itemsOnPage;
					itemsOnPage = 0;
					break;
				default:
					i++;
					this.layoutData.items--;
					itemsOnPage++;
					firstOccurence = true;
			}
		}
	},

	calculateDimensions: function() {
		var dimensions = this.dimensions;

		//get window height / width
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();

		//if the window size did not change, no need to recalculate dimensions
		if (dimensions.windowWidth && dimensions.windowWidth === windowWidth && dimensions.windowHeight && dimensions.windowHeight === windowHeight) {
			return;
		}

		//cache the window height/width
		dimensions.windowHeight = windowHeight;
		dimensions.windowWidth = windowWidth;

		//copy gutter width out of the options for easy access
		dimensions.gutterWidth = this.options.gutterWidth;

		//copy minLinesPerColumn out of options for eacy access
		dimensions.minLinesPerColumn = this.options.minLinesPerColumn;

		//get the margins of the section container
		dimensions.sectionMargin = {
			left : parseInt(this.$el.css("margin-left"), 10),
			top : parseInt(this.$el.css("margin-top"), 10),
			right : parseInt(this.$el.css("margin-right"), 10),
			bottom : parseInt(this.$el.css("margin-bottom"), 10)
		};

		//get the padding of the section container
		dimensions.sectionPadding = {
			left : parseInt(this.$el.css("padding-left"), 10),
			top : parseInt(this.$el.css("padding-top"), 10),
			right : parseInt(this.$el.css("padding-right"), 10),
			bottom : parseInt(this.$el.css("padding-bottom"), 10)
		};

		//determine the correct height for the section container to eliminate scrolling
		dimensions.outerSectionHeight = windowHeight - dimensions.sectionMargin.top - dimensions.sectionMargin.bottom;
		dimensions.innerSectionHeight = dimensions.outerSectionHeight - dimensions.sectionPadding.top - dimensions.sectionPadding.bottom;

		//determine the correct width for the section container
		dimensions.outerSectionWidth = this.$el.outerWidth();
		dimensions.innerSectionWidth = dimensions.outerSectionWidth - dimensions.sectionPadding.left - dimensions.sectionPadding.right;

		//column width
		if (dimensions.innerSectionWidth < this.options.maxColumnWidth) {
			dimensions.columnWidth = dimensions.innerSectionWidth;
		} else {
			dimensions.columnWidth = this.options.maxColumnWidth;
		}

		//Determine the number of columns per page
		dimensions.columnsPerPage = Math.floor(dimensions.innerSectionWidth / dimensions.columnWidth);
		if (dimensions.innerSectionWidth < (dimensions.columnsPerPage * dimensions.columnWidth) + ((dimensions.columnsPerPage - 1) * this.options.gutterWidth))
		{
			dimensions.columnsPerPage = dimensions.columnsPerPage - 1;
		}

		//Large gutters look ugly... reset column width if gutters get too big
		var gutterCheck = (dimensions.innerSectionWidth - (dimensions.columnsPerPage * dimensions.columnWidth)) / (dimensions.columnsPerPage - 1);
		if (gutterCheck > this.options.gutterWidth) {
			dimensions.columnWidth = (dimensions.innerSectionWidth - (this.options.gutterWidth * (dimensions.columnsPerPage - 1))) / dimensions.columnsPerPage;
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

		var figureRefTemplate = OsciTk.templateManager.get('figure-reference');
		//remove any inline figures and replace with references
		var inlineFigures = this.layoutData.data.find("figure").replaceWith(function(){
			var $this = $(this);
			var figureData = {
				id : $this.attr("id"),
				title : $this.attr("title")
			};

			return $(figureRefTemplate(figureData));
		});

		//chunk the data into managable parts
		this.layoutData.data = this.layoutData.data.find('section').children();
	},

	getFigureView: function(figureId) {
		var childViews = this.getChildViews();
		var figureView;

		var numPageViews = childViews.length;
		for (var i = 0; i < numPageViews; i++) {
			var pageChildViews = childViews[i].getChildViewsByType('figure');
			var numPageChildViews = pageChildViews.length;
			for (var j = 0; j < numPageChildViews; j++) {
				if (figureId === pageChildViews[j].$el.attr('id')) {
					figureView = pageChildViews[j];
					break;
				}
			}

			if (figureView) {
				break;
			}
		}

		return figureView;
	}
});