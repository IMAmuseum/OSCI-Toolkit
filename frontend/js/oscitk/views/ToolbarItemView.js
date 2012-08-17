OsciTk.views.ToolbarItem = OsciTk.views.BaseView.extend({
	className: 'toolbar-item',
	template: OsciTk.templateManager.get('toolbar-item'),
	initialize: function() {
		// add a class to this element based on view button uses
		this.$el.addClass(this.options.toolbarItem.view + '-toolbar-item');
		// tracks the view to render in the content area when this view is clicked
		this.contentView = null;
		this.contentViewRendered = false;
	},
	events: {
		'click': 'itemClicked',
		'touch': 'itemClicked'
	},
	onClose: function() {
		this.contentView.close();
	},
	render: function() {
		this.contentView = new OsciTk.views[this.options.toolbarItem.view]({parent: this});
		this.$el.html(this.template({
			text: this.options.toolbarItem.text
		}));
	},
	itemClicked: function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (!this.contentViewRendered) {
			this.contentView.render();
			this.contentViewRendered = true;
		}

		this.parent.setActiveToolbarItemView(this);
		this.parent.toggleContentView();

		if (this.contentView.active) {
			this.contentView.active();
		}
	}
});