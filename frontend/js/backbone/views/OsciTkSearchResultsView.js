jQuery(function() {
	window.OsciTkSearchResultsView = OsciTkView.extend({
		id: 'search-results-container',
		template: _.template($('#template-search-results').html()),
		initialize: function(results) {
			console.log(results);
			this.collection = new OsciTkSearchResults();
			//this.collection.reset(results);
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});