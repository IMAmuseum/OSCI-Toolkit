jQuery(function() {
	window.OsciTkNotesView = OsciTkView.extend({
		className: 'notes-view',
		template: _.template($('#template-notes').html()),
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});