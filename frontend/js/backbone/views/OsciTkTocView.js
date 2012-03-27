jQuery(function() {
	window.OsciTkTocView = OsciTkView.extend({
		className: 'toc-view',
		template: _.template($('#template-toc').html()),
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});