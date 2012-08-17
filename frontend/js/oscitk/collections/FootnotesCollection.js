OsciTk.collections.Footnotes = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.Footnote,

	initialize: function() {
		app.dispatcher.on('footnotesAvailable', function(footnotes) {
			this.populateFromMarkup(footnotes);
			app.dispatcher.trigger('footnotesLoaded', this);
		}, this);
	},

	populateFromMarkup: function(data) {
		_.each($('aside', data), function(markup) {
			var idComponents = markup.id.match(/\w+-(\d+)-(\d+)/);
			var footnote = {
				id:         markup.id,
				rawData:    markup,
				body:       markup.innerHTML,
				section_id: idComponents[1],
				delta:      idComponents[2]
			};
			this.add(footnote);
		}, this);
	}
});