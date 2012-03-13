jQuery(function() {
	window.OsciTkReaderView = OsciTkView.extend({
		id: 'reader',
		template: _.template($('#template-reader').html()),
		
		initialize: function() {
			$('body').append(this.el);
		},
		
		render: function() {
			this.$el.html(this.template());
		},
		
		addView: function(view) {
			view.parent = this;
			this.$el.append(view.el);
		}
	});
});