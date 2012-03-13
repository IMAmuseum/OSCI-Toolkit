jQuery(function() {
	window.OsciTkReader = Backbone.View.extend({
		id: 'reader',
		template: _.template($('#template-reader').html()),
		initialize: function() {
			this.$el.html(this.template());
			$('body').append(this.el);
		}
	});
});