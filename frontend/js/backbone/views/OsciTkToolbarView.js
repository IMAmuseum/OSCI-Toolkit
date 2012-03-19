jQuery(function() {
	window.OsciTkToolbarView = OsciTkView.extend({
		id: 'toolbar',
		template: _.template($('#template-toolbar').html()),
		initialize: function() {
			this.render();
		},
		render: function() {
			console.log(this.template(), 'this.template');
			this.$el.html(this.template());
		}
	});
});