OsciTk.collections.Figures = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.Figure,

	initialize: function() {
		app.dispatcher.on('figuresAvailable', function(figures) {
			this.populateFromMarkup(figures);
			app.dispatcher.trigger('figuresLoaded', this);
		}, this);
	},

	comparator: function(figure) {
		return figure.get('delta');
	},

	/**
	 * Populates the collection from an array of figure markup
	 */
	populateFromMarkup: function(data) {
		var figures = [];
		_.each(data, function(markup) {

			var idComponents = markup.id.match(/\w+-(\d+)-(\d+)/);
			var $markup = $(markup);

			var figure = {
				id:         markup.id,
				rawData:    markup,
				body:       markup.innerHTML,
				section_id: idComponents[1],
				delta:      idComponents[2],
				title:      $markup.attr('title'),
				caption:    $markup.find('figcaption').html(),
				content:    $markup.find('.figure_content').html(),
				position:   $markup.data('position'),
				columns:    $markup.data('columns'),
				options:    $markup.data('options'),
				thumbnail_url: undefined, // Defaults to image defined in css
				type:       $markup.data('figure_type'),
				aspect:     $markup.data('aspect')
			};

			// First, check for an explicit thumbnail
			var thumbnail = $markup.children('img.thumbnail').remove();
			if (thumbnail.length) {
				figure.thumbnail_url = thumbnail.attr('src');
				figure.preview_url = thumbnail.attr('src');
			} else {
				// No explicit thumbnail, default to the first image in the figure content
				var image = $('.figure_content img', markup);
				if (image.length) {
					figure.thumbnail_url = image.attr('src');
					figure.preview_url = image.attr('src');
				}
				// TODO: Default to the figure type default? Also via css?
			}

			// add the figure to the array for adding to the collection
			figures.push(figure);

		}, this);

		// populate the collection
		this.reset(figures);
	}
});