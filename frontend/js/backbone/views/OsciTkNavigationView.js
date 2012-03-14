jQuery(function() {
	window.OsciTkNavigationView = OsciTkView.extend({
		id: 'navigation',
		template: _.template($('#template-navigation').html()),
		initialization: function() {
			
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});