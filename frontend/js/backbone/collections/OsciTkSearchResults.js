jQuery(function() {
	window.OsciTkSearchResults = OsciTkCollection.extend({
		model: OsciTkSearchResult,
		initialize: function() {
			this.numFound = 0;
			this.page = 0;
		}
	});
});