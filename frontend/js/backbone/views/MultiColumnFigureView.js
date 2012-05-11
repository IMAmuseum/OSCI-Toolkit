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

		this.$el.css("visibility", "visible");
	},

	renderContent: function() {
		this.$el.find(".figure_content").html(this.model.get('content'));
	},

	positionElement: function() {
		var modelData = this.model.toJSON();
		var dimensions = this.options.sectionDimensions;
		console.log(this.options.sectionDimensions, 'dimensions');
		console.log(modelData, "figure data");
		console.log(modelData.position, "position");

		//if element shouold not be visible on the page, hide it and return
		if (modelData.position.vertical === "n") {
			this.$el.hide();
			return this;
		}

		var column;
		//Detemine the start column based on the layout hint
		switch (modelData.position.horizontal) {
			//right
			case 'r':
				column = dimensions.columnsPerPage - 1;
				break;
			//left & fullpage
			case 'l':
			case 'p':
				column = 0;
				break;
			//In the current column
			default:
				column = this.parent.processingData.currentColumn;
		}

		console.log(column, "column");

		var placed = false;
		var numColumns = this.model.get('columns');
		var offsetLeft = 0;
		var offsetTop = 0;

		while (!placed) {
			
			//Detemine the left offset start column and width of the figure
			if ((column + numColumns) > dimensions.columnsPerPage) {
				column -= (column + numColumns) - dimensions.columnsPerPage;
			}

			offsetLeft = (column * dimensions.columnWidth) + (column * dimensions.gutterWidth);
			this.$el.css("left", offsetLeft + "px");
console.log(offsetLeft, "offsetLeft");
			//Determine the top offset based on the layout hint
			switch (modelData.position.vertical) {
				//top & fullpage
				case 't':
				case 'p':
					offsetTop = 0;
					break;
				//bottom
				case 'b':
					offsetTop = dimensions.innerSectionHeight - this.calculatedHeight;
					break;
			}
			this.$el.css("top", offsetTop + "px");
console.log(offsetTop, "offsetTop");
			// //Determine which columns this figure will occupy and add it to the figure data
			// for (i = 0; i < base.options.columnsPerPage; i++) {
			// colStart = (base.options.columnWidth * i) + (base.options.gutterWidth * i) + base.options.innerPageGutter[3];
			// colEnd = (base.options.columnWidth * (i + 1)) + (base.options.gutterWidth * i) + base.options.innerPageGutter[3];

			// if (offsetLeft <= colEnd && (offsetLeft + width) >= colStart) {
			// columnCoverage[i] = true;
			// } else {
			// columnCoverage[i] = false;
			// }
			// }
			// figure.data("column_coverage", columnCoverage).addClass("processed");

			// figureX = [offsetLeft, offsetLeft + width];
			// figureY = [offsetTop, offsetTop + height];

			// placed = true;

			// //base.options.pageWidth;
			// if (offsetLeft < 0 || (offsetLeft + width) > base.options.pageWidth) {
			// placed = false;
			// }

			// //check if current placement overlaps any other figures
			// if (placed && pageFigures.length) {
			// for (i = 0; i < pageFigures.length; i++) {
			// var $elem = $(pageFigures[i]),
			// calcPosition = $elem.position(),
			// elemX = [calcPosition.left, calcPosition.left + $elem.outerWidth()],
			// elemY = [calcPosition.top, calcPosition.top + $elem.outerHeight()];

			// if (figureX[0] < elemX[1] && figureX[1] > elemX[0] &&
			// figureY[0] < elemY[1] && figureY[1] > elemY[0]
			// ) {
			// placed = false;
			// break;
			// }
			// }
			// }

			// if (!placed) {
			// //adjust the start column to see if the figure can be placed on the page
			// switch (horizontalPosition) {
			// //right
			// case 'r':
			// column--;
			// if (column < 0) {
			// placementAttempts = base.options.columnsPerPage;
			// }
			// break;
			// //left & fullpage
			// case 'l':
			// case 'p':
			// column++;
			// if (column >= base.options.columnsPerPage) {
			// placementAttempts = base.options.columnsPerPage;
			// }
			// break;
			// //no horizontal position
			// default:
			// column++;
			// if ((column + columns) > base.options.columnsPerPage) {
			// column = 0;
			// }
			// }
			// }
			placed = true;
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