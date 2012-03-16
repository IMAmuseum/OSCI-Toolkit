jQuery(function() {
	window.OsciTkFigures = OsciTkCollection.extend({
		model: OsciTkFigure,
		
		initialize: function() {
			this.dispatcher.bind('figuresAvailable', function(figures) {
				console.log(figures, 'figures for collection');
			});
		}
	});
});