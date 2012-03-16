jQuery(function() {
	window.OsciTkFigures = OsciTkCollection.extend({
		model: OsciTkFigure,
		
		initialize: function() {
			this.dispatcher.bind('figuresAvailable', function(figures) {
				this.populateFromMarkup(figures);
			}, this);
		},
		
		populateFromMarkup: function(data) {
			_.each($('figure', data), function(markup) {
				console.log(markup);
				var idComponents = markup.id.match(/\w+-(\d+)-(\d+)/);
				var figure = {
					id:         markup.id,
					rawData:    markup,
					body:       markup.innerHTML,
					section_id: idComponents[1],
					delta:      idComponents[2],
					title:      $(markup).attr('title'),
					caption:    $('figcaption', markup).html(),
					position:   $(markup).attr('data-position'),
					columns:    $(markup).attr('data-columns'),
					options:    JSON.parse($(markup).attr('data-options'))
				};
				this.create(figure, {dispatcher: this.dispatcher})
			}, this);
		}
	});
});