jQuery(function() {
	window.OsciTkView = Backbone.View.extend({
		addView: function(view) {
			view.parent = this;
			this.$el.append(view.el);
		}
	});
});