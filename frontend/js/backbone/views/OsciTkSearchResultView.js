jQuery(function() {
	window.OsciTkSearchResultView = OsciTkView.extend({
		id: 'search-results-container',
		template: _.template($('#template-search-results').html()),
		initialize: function(results) {
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});