jQuery(function() {
	window.OsciTkSearchView = OsciTkView.extend({
		className: 'search-view',
		template: _.template($('#template-search').html()),
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});