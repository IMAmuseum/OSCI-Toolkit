jQuery(function() {
	window.OsciTkToolbarView = OsciTkView.extend({
		id: 'toolbar',
		template: _.template($('#template-toolbar').html()),
		initialize: function() {
			// if toolbar items were provided, store them in the view
			this.toolbarItems = this.options.toolbarItems ? this.options.toolbarItems : null;
			this.toolbarItemViews = [];
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
			_.each(this.toolbarItems, function(toolbarItem) {
				var options = {
					dispatcher: this.dispatcher,
					toolbarItem: toolbarItem
				};
				var item = new OsciTkToolbarItemView(options);
				this.toolbarItemViews.push(item);
				this.addView(item, '#toolbar-handle');
			}, this);
		}
	});
});