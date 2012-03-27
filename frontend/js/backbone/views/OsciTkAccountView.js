jQuery(function() {
	window.OsciTkAccountView = OsciTkView.extend({
		className: 'account-view',
		template: _.template($('#template-account').html()),
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});