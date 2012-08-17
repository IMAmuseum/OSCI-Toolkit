OsciTk.views.SearchResults = OsciTk.views.BaseView.extend({
	id: 'search-results-container',
	template: OsciTk.templateManager.get('search-results'),
	initialize: function(response) {
		console.log(response);
		this.searchResults = new OsciTk.collections.SearchResults({docs: response.docs});
		this.render();
	},
	render: function() {
		this.$el.html(this.template());
	}
});