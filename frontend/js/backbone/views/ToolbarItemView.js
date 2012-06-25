// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

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
	render: function() {
		this.contentView = new OsciTk.views[this.options.toolbarItem.view]({parent: this});
		this.parent.addView(this.contentView, '#toolbar-content');
		this.$el.html(this.template({
			text: this.options.toolbarItem.text
		}));
	},
	itemClicked: function() {
		if (!this.contentViewRendered) {
			this.contentView.render();
			this.contentViewRendered = true;
		}
		
		var children;
		// content tab is closed.  assign active view and open
		if (this.parent.isContentOpen === false) {
			// the toolbar should know who the active view is
			this.parent.activeContentView = this.options.toolbarItem.view;
			// hide all the views besides this one
			children = this.parent.$el.find('#toolbar-content').children().not('#' + this.contentView.id + ', h2');
			children.hide();

			this.contentView.$el.show();
			// animate the opening of the toolbar
			this.parent.contentOpen();
		}
		// content tab is open already
		else {
			// if active view is this one, close the panel
			if (this.parent.activeContentView == this.options.toolbarItem.view) {
				// closing the toolbar, so clear the active view
				this.parent.activeContentView = null;
				// animate the closing of the toolbar
				this.parent.contentClose();
			}
			// if this isn't the active view, assign active view and switch
			else {
				// the toolbar should know this is now the active view
				this.parent.activeContentView = this.options.toolbarItem.view;
				// hide all the views besides this one
				children = this.parent.$el.find('#toolbar-content').children().not('#' + this.contentView.id + ', h2');
				children.hide();

				this.contentView.$el.show();
				// animate the switch
				this.parent.contentOpen();
			}
		}
	}
});