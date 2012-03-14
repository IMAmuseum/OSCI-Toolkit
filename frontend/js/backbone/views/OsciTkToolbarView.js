jQuery(function() {
	window.OsciTkToolbarView = OsciTkView.extend({
		id: 'toolbar',
		template: _.template($('#template-toolbar').html()),
		
		render: function() {
			this.$el.html(this.template());
		}
	});
});