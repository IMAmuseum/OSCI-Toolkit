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
			console.log(this);
			if (this.contentView === null) {
				this.contentView = new window[this.options.toolbarItem.view](this.options);
				this.parent.addView(this.contentView, '#toolbar-content');
			}
			
			if (this.parent.isContentOpen === false) {
				// content tab is closed.  assign active view and open
				this.parent.activeContentView = this.options.toolbarItem.view;
				this.parent.contentOpen();
			}
			else {
				// content tab is open already

				// if active view is this one, close the panel
				if (this.parent.activeContentView == this.options.toolbarItem.view) {
					this.parent.activeContentView = null;
					this.parent.contentClose();
				}
				// if this isn't the active view, assign active view and switch
				else {
					this.parent.activeContentView = this.options.toolbarItem.view;
					this.parent.contentOpen();
				}
			}
		}
	});
});