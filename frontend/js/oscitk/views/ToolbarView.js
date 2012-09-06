OsciTk.views.Toolbar = OsciTk.views.BaseView.extend({
	id: 'toolbar',
	template: OsciTk.templateManager.get('toolbar'),
	initialize: function() {
		// if toolbar items were provided, store them in the view
		this.toolbarItems = app.config.get('toolbarItems') ? app.config.get('toolbarItems') : [];

		// tracks the state of the content area drawer
		this.isContentOpen = false;
		this.activeToolbarItemView = undefined;
		this.activeToolbarItemViewChanged = false;
		this.render();

		app.dispatcher.on("packageLoaded", function(packageModel) {
			//Add the publication title to the Toolbar
			var title = packageModel.getTitle();
			if (title) {
				this.$el.find("#toolbar-title").text(title);
			}
		}, this);

		//Close the toolbar if a user clicks outside of it
		$(window).on("click", {view: this}, function(e) {
			var target = $(e.target).parents('#' + e.data.view.id);
			if (e.data.view.isContentOpen && target.length === 0) {
				e.data.view.contentClose();
			}
		});
	},
	events: {
		"click #toolbar-close": "contentClose"
	},
	render: function() {
		this.$el.html(this.template());

		_.each(this.toolbarItems, function(toolbarItem) {
			var item = new OsciTk.views.ToolbarItem({toolbarItem: toolbarItem});
			this.addView(item, '#toolbar-handle');
			item.render();
		}, this);
	},
	setActiveToolbarItemView: function(view) {
		if ((this.activeToolbarItemView && view.cid !== this.activeToolbarItemView.cid) || this.activeToolbarItemView === undefined) {
			this.activeToolbarItemViewChanged = true;
			if (this.activeToolbarItemView) {
				this.activeToolbarItemView.contentView.$el.detach();
			}
		} else {
			this.activeToolbarItemViewChanged = false;
		}
		this.activeToolbarItemView = view;
		this.$el.find("#toolbar-content").html(view.contentView.$el);

		//Redelegate events for contentView
		view.contentView.delegateEvents();

		return this;
	},
	toggleContentView: function() {
		//toolbar closed, open it
		if (!this.isContentOpen) {
			this.contentOpen();
			return this;
		}

		//close the toolbar the same toolbar item view was clicked
		if (!this.activeToolbarItemViewChanged) {
			this.contentClose();
			return this;
		//update the height for the new view
		} else {
			this.updateHeight();
			return this;
		}
	},
	contentOpen: function() {
		this.updateHeight();

		this.isContentOpen = true;
	},
	updateHeight: function() {
		var toolbarContent = this.$el.find('#toolbar-content');

		var toolbarHeight = this.$el.height();
		//clear height form content or resize does not work
		toolbarContent.height("");
		var toolbarContentHeight = toolbarContent.height();

		var toolbarTitleHeight = $('#toolbar-title-container').outerHeight();

		if (toolbarContentHeight > (toolbarHeight - toolbarTitleHeight)) {
			toolbarContent.height((toolbarHeight - toolbarTitleHeight) + 'px');
		} else {
			toolbarContent.height('');
		}

		this.$el.css({
			top: 0
		});
	},
	contentClose: function() {
		this.$el.css({
			top: '-' + this.$el.height() + 'px'
		});

		this.isContentOpen = false;
	}
});