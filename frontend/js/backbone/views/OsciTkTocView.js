jQuery(function() {
	window.OsciTkTocView = OsciTkView.extend({
		className: 'toc-view',
		template: _.template($('#template-toc').html()),
		initialize: function() {
			this.dispatcher.on('navigationLoaded', function(navigation) {
				console.log(navigation, 'toc view nav loaded');
			}, this);
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});