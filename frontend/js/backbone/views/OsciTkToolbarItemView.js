jQuery(function() {
	window.OsciTkToolbarItemView = OsciTkView.extend({
		className: 'toolbar-item',
		template: _.template($('#template-toolbar-item').html()),
		initialize: function() {
			// add a class to this element based on view button uses
			this.$el.addClass(this.options.toolbarItem.view + '-toolbar-item');
			// tracks the view to render in the content area when this view is clicked
			this.contentView = null;
			this.render();
		},
		events: {
			'click': 'itemClicked'
		},
		render: function() {
			this.$el.html(this.template({
				text: this.options.toolbarItem.text
			}));
		},
		itemClicked: function() {
			if (this.contentView === null) {
				this.contentView = new window[this.options.toolbarItem.view](this.options);
			}
			this.parent.replaceView(this.contentView, '#toolbar-content');
			if (this.parent.isContentOpen == false) {
				this.parent.contentOpen();
			}
			else {
				this.parent.contentClose();
			}
		}
	});
});