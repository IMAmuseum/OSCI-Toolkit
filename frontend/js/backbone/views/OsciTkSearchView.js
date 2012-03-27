jQuery(function() {
	window.OsciTkSearchView = OsciTkView.extend({
		id: 'section',
		template: _.template($('#template-section').html()),
		initialize: function() {
			// bind navigationLoaded
			this.dispatcher.on('navigationLoaded', function(navigation) {
				console.log(navigation, 'loaded navigation');
				// populate the sections collection
				_.each(navigation.get('toc').children, function(section) {
					this.populateSections(section);
				}, this);
				// initialization complete, router takes back over
			}, this);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
		}
	});
});