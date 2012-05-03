// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.MultiColumnPage = OsciTk.views.Page.extend({
	columnTemplate : OsciTk.templateManager.get('multi-column-column'),
	onClose: function() {
		this.model = undefined;
	},
	render : function() {
		if (this.processingData.rendered) {
			return this;
		}

		//size the page to fit the view window
		this.$el.css({
			width: this.parent.dimensions.innerPageWidth,
			height: this.parent.dimensions.innerPageHeight
		});

		this.processingData.columns = [];
		for (var i = 0; i < this.parent.dimensions.columnsPerPage; i++) {
			this.processingData.columns[i] = {
				height : this.parent.dimensions.innerPageHeight,
				heightRemain : this.parent.dimensions.innerPageHeight,
				'$el' : null,
				offset : 0
			};
		}
		this.processingData.currentColumn = 0;

		//set rendered flag so that render does not get called more than once while iterating over content
		this.processingData.rendered = true;

		return this;
	},
	layoutContent : function() {
		var column = this.getCurrentColumn();

		var content = $(this.model.get('content')[(this.model.get('content').length - 1)]);

		column.$el.append(content);

		var lineHeight = parseFloat(content.css("line-height"));

		//If all of the content is overflowing the column remove it and move to next column
		if ((column.height - content.position().top) < lineHeight) {
			content.remove();
			column.heightRemain = 0;
			return true;
		}

		var contentHeight = content.outerHeight(true);

		//If offset defined (should always be negative) add it to the height of the content to get the correct top margin
		var offset = 0;
		if (column.offset < 0) {
			offset = contentHeight + column.offset;

			//Set the top margin
			content.css("margin-top", "-" + offset + "px");

			//remove the offset so that all items are not shifted up
			column.offset = 0;
		}

		//find figure references and process the figure
		var figureLinks = content.find("a.figure_reference:not(.processed)");
		//console.log(figureLinks, 'figureLinks');
		if (figureLinks.length) {
			
		}

		var contentMargin = {
			top : parseInt(content.css("margin-top"), 10),
			bottom : parseInt(content.css("margin-bottom"), 10)
		};

		//Update how much vertical height remains in the column
		var heightRemain = column.heightRemain - content.outerHeight(true);
		if (heightRemain > 0 && heightRemain < lineHeight) {
			heightRemain = 0;
		} else if (heightRemain < 0 && heightRemain >= (contentMargin.bottom * -1)) {
			heightRemain = 0;
		}

		//If we have negative height remaining, the content must be repeated in the next column
		var overflow = false;
        if (heightRemain < 0) {
            var overflowHeight = heightRemain ,
				hiddenLines = Math.ceil(overflowHeight / lineHeight),
				newHeight = content.position().top + content.outerHeight() + (hiddenLines * lineHeight);

			//assign the new height to remove any partial lines of text
			column.height = newHeight;
			column.$el.height(newHeight + "px");

			if (hiddenLines === 0) {
				heightRemain = 0;
				overflow = false;
			} else {
				heightRemain = (hiddenLines * lineHeight) - contentMargin.bottom;
				overflow = true;
			}

            if (this.processingData.currentColumn === (this.parent.dimensions.columnsPerPage - 1)) {
				this.processingComplete();
            }
        }

        if (heightRemain === 0 && this.processingData.currentColumn === (this.parent.dimensions.columnsPerPage - 1)) {
			this.processingComplete();
        }

        column.heightRemain = heightRemain;

		return overflow;
	},

	getCurrentColumn : function() {
		var currentColumn = null;

		if (this.processingData.columns[this.processingData.currentColumn] && this.processingData.columns[this.processingData.currentColumn].heightRemain > 0) {
			currentColumn = this.processingData.columns[this.processingData.currentColumn];
		} else {
			for(var i = 0; i < this.parent.dimensions.columnsPerPage; i++) {
				if (this.processingData.columns[i].heightRemain > 0) {
					currentColumn = this.processingData.columns[i];
					this.processingData.currentColumn = i;
					break;
				}
			}
		}

		if (currentColumn !== null && currentColumn.$el === null) {
			if (this.processingData.currentColumn > 0) {
				currentColumn.offset = this.processingData.columns[(this.processingData.currentColumn - 1)].heightRemain;
			} else {
				var previousPage = this.parent.getChildViewByIndex(this.parent.getChildViews().length - 2);
				if (previousPage) {
					currentColumn.offset = previousPage.processingData.columns[previousPage.processingData.columns.length - 1].heightRemain;
				}
			}

			var columnCss = {
				width : this.parent.dimensions.columnWidth + "px",
				height : currentColumn.height + "px",
				left : (this.processingData.currentColumn * this.parent.dimensions.columnWidth) + (this.parent.dimensions.gutterWidth * this.processingData.currentColumn)
			};

			currentColumn.$el = $(this.columnTemplate())
				.appendTo(this.$el)
				.addClass('column-' + this.processingData.currentColumn)
				.css(columnCss);
		}

		return currentColumn;
	}
});