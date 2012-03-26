jQuery(function() {
	window.OsciTKSearchResults = OsciTkCollection.extend({
		model: OsciTKSearchResult,
		initialize: function() {
			this.numFound = 0;
			this.page = 0;
		}
	});
});