jQuery(function() {
	window.OsciTkReaderView = Backbone.View.extend({
		id: 'reader',
		template: _.template($('#template-reader').html()),
		
		initialize: function() {
			// apply our reader div
			this.$el.html(this.template());
			$('body').append(this.el);
		},
		
		addView: function(view) {
			view.parent = this;
			this.$el.append(view.el);
		}
	});
});