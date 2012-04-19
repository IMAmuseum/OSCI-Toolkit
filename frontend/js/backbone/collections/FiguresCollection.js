// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.collections.Figures = OsciTk.collections.BaseCollection.extend({
		model: OsciTk.models.Figure,
		
		initialize: function() {
			app.dispatcher.bind('figuresAvailable', function(figures) {
				this.populateFromMarkup(figures);
			}, this);
		},

		comparator: function(figure) {
			return figure.get('delta');
		},
		
		/**
		 * Populates the collection from an array of figure markup
		 */
		populateFromMarkup: function(data) {
			_.each(data, function(markup) {
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
				this.add(figure);
			}, this);
		}
	});
});