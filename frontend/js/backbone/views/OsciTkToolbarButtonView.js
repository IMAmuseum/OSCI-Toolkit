jQuery(function() {
	window.OsciTkToolbarButtonView = OsciTkView.extend({
		template: _.template($('#template-toolbar-button').html()),
		initialize: function(options) {
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});