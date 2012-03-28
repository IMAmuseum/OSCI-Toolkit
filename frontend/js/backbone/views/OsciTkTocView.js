jQuery(function() {
	window.OsciTkTocView = OsciTkView.extend({
		className: 'toc-view',
		template: _.template($('#template-toc').html()),
		initialize: function() {
			this.parent = this.options.parent;
			// this.render();
			this.dispatcher.on('navigationLoaded', function(navigation) {
				console.log(navigation, 'tocview navigation loaded');
				this.navigation = navigation;
				console.log(this.navigation, 'really?');
			}, this);
		},
		render: function() {
			console.log(this, 'flksdjflsdjflksjflksj');
			var toc = this.navigation.get('toc');
			console.log(toc, 'toc');
			this.$el.html(this.template());
		}
	});
});