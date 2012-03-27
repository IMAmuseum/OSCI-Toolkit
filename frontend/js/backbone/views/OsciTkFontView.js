jQuery(function() {
	window.OsciTkFontView = OsciTkView.extend({
		className: 'font-view',
		template: _.template($('#template-font').html()),
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});