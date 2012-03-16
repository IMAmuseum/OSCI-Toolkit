jQuery(function() {
	window.OsciTkFootnotes = OsciTkCollection.extend({
		model: OsciTkFootnote,
		
		initialize: function() {
			this.dispatcher.bind('footnotesAvailable', function(footnotes) {
				this.populateFromMarkup(footnotes);
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
				this.create(footnote, {dispatcher: this.dispatcher});
			}, this);
		}
		
	});
});