jQuery(function() {
	window.OsciTkToolbarView = OsciTkView.extend({
		id: 'toolbar',
		template: _.template($('#template-toolbar').html()),
		initialize: function(options) {
			console.log(options, 'toolbar-options');
			// if toolbar items were provided, store them in the view
			if (options.toolbarItems && options.toolbarItems.length > 0) {
				this.toolbarItems = options.toolbarItems;
			}
			this.render();
		},
		render: function() {
			console.log(this.toolbarItems, 'toolbarItems');
			
			this.$el.html(this.template());
		}
	});
});