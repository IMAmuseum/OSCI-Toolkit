jQuery(function() {
	window.OsciTkToolbarItemView = OsciTkView.extend({
		className: 'toolbar-item',
		template: _.template($('#template-toolbar-item').html()),
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});