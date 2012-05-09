// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //


OsciTk.views.MultiColumnFigure = OsciTk.views.BaseView.extend({

	tagName: 'figure',
	template: OsciTk.templateManager.get('multi-column-figure'),
	layoutComplete: false,
	sizeCalculated: false,
	calculatedHeight: 0,
	calculatedWidth: 0,

	initialize: function() {
		this.$el.css("visibility", "hidden");
	},

	render: function() {
		//template the element
		this.$el.html(this.template(this.model.toJSON()));

		//calculate the size based on layout hints
		this.sizeElement();

		//position the element on the page
		this.positionElement();
	},

	renderContent: function() {
		this.$el.find(".figure_content").html(this.model.get('content'));
	},

	positionElement: function() {
		var modelData = this.model.toJSON();
		// console.log(this.options.sectionDimensions, 'dimensions');
		// console.log(modelData, "figure data");
		// console.log(modelData.position, "position");
		//if element shouold not be visible on the page, hide it and return
		if (modelData.position === "n") {
			this.$el.hide();
			return this;
		}

		
		
		
	},

	sizeElement: function() {
		var width, height;
		var dimensions = this.options.sectionDimensions;
		var modelData = this.model.toJSON();

		//Only process size data on first attempt to place this figure
		if (this.sizeCalculated || modelData.position === "n") {
			this.calculatedHeight = this.$el.height();
			this.calculatedWidth = this.$el.width();
			return this;
		}

		//If a percentage based width hint is specified, convert to number of columns to cover
		if (typeof(modelData.columns) === 'string' && modelData.columns.indexOf("%") > 0) {
			modelData.columns = Math.ceil((parseInt(modelData.columns, 10) / 100) * dimensions.columnsPerPage);
		}

		//Calculate maximum width for a figure
		if (modelData.columns > dimensions.columnsPerPage || modelData.position === 'p') {
			width = dimensions.innerSectionWidth;
			modelData.columns = dimensions.columnsPerPage;
		} else {
			width = (modelData.columns * dimensions.columnWidth) + (dimensions.gutterWidth * (modelData.columns - 1));
		}
		this.$el.css("width", width + "px");

		//Get the height of the caption
		var captionHeight = this.$el.find("figcaption").outerHeight(true);

		//Calculate height of figure plus the caption
		height = (width / modelData.aspect) + captionHeight;

		//If the height of the figure is greater than the page height, scale it down
		if (height > dimensions.innerSectionHeight) {
			height = dimensions.innerSectionHeight;

			//set new width and the new column coverage number
			width = (height - captionHeight) * modelData.aspect;
			figure.css("width", width + "px");

			//update caption height at new width
			captionHeight = this.$el.find("figcaption").outerHeight(true);

			//update column coverage
			modelData.columns = Math.ceil((width + dimensions.gutterWidth) / (dimensions.gutterWidth + dimensions.columnWidth));
		}

		//round the height/width to 2 decimal places
		width = roundNumber(width,2);
		height = roundNumber(height,2);

		this.$el.css({ height : height + "px", width : width + "px"});

		this.calculatedHeight = height;
		this.calculatedWidth = width;

		//update model number of columns based on calculations
		this.model.set('columns', modelData.columns);

		//Set the size of the figure content div inside the actual figure element
		this.$el.find('.figure_content').css({
			width : width,
			height : height - captionHeight
		});

		this.sizeCalculated = true;
		return this;
	}
});