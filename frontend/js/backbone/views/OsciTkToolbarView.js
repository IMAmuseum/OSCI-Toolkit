jQuery(function() {
	window.OsciTkToolbarView = OsciTkView.extend({
		id: 'toolbar',
		template: _.template($('#template-toolbar').html()),
		initialize: function() {
			// if toolbar items were provided, store them in the view
			this.toolbarItems = this.options.toolbarItems ? this.options.toolbarItems : null;
			this.toolbarItemViews = [];
			// tracks the state of the content area drawer
			this.isContentOpen = false;
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
		},
		contentOpen: function() {
			var toolbarContent = this.$el.find('#toolbar-content');
			toolbarContent.show();
			this.$el.animate({
				'height': toolbarContent.outerHeight() + this.$el.find('#toolbar-handle').outerHeight() + 'px',
			}, 'fast');
			this.isContentOpen = true;
		},
		contentClose: function() {
			this.$el.animate({
				'height': this.$el.find('#toolbar-handle').outerHeight() + 'px', 
				'width': '100%'
			}, 'fast', function() {
				$(this).find('#toolbar-content').hide();
			});
			this.isContentOpen = false;
		}
	});
});