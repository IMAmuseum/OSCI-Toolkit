// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.Toolbar = OsciTk.views.BaseView.extend({
	id: 'toolbar',
	template: OsciTk.templateManager.get('toolbar'),
	initialize: function() {
		// if toolbar items were provided, store them in the view
		this.toolbarItems = app.config.get('toolbarItems') ? app.config.get('toolbarItems') : [];
		this.toolbarItemViews = [];
		// tracks the state of the content area drawer
		this.isContentOpen = false;
		this.render();

		app.dispatcher.on("packageLoaded", function(packageModel) {
			//Add the publication title to the Toolbar
			var metadata = packageModel.get("metadata");
			if (metadata['dc:title'] && metadata['dc:title']['value']) {
				this.$el.find("#toolbar-title").text(metadata['dc:title']['value']);
			}
		}, this);
	},
	events: {
		"click #toolbar-close": "contentClose"
	},
	render: function() {
		this.$el.html(this.template());

		_.each(this.toolbarItems, function(toolbarItem) {
			var item = new OsciTk.views.ToolbarItem({toolbarItem: toolbarItem});
			this.toolbarItemViews.push(item);
			this.addView(item, '#toolbar-handle');
			item.render();
		}, this);
	},
	contentOpen: function() {
		this.updateHeight();

		this.isContentOpen = true;
	},
	updateHeight: function() {
		var toolbarContent = this.$el.find('#toolbar-content');
		var toolbarHandleHeight = this.$el.find('#toolbar-handle').outerHeight();
		var toolbarHeight = toolbarContent.outerHeight() + toolbarHandleHeight;
		// console.log(toolbarHeight, 'toolbarHeight calculated');
		var toolbarMaxHeightPercentage = parseInt(this.$el.css('max-height'), 10);
		var toolbarMaxHeight = $(window).height() * (toolbarMaxHeightPercentage / 100);
		if (toolbarHeight > toolbarMaxHeight) {
			toolbarContent.height(toolbarMaxHeight - toolbarHandleHeight);
		}
		this.$el.css({
			'height': toolbarHeight + 'px'
		});

		$('#toolbar-close').css({
			top: "10px"
		});
	},
	contentClose: function() {
		$('#toolbar-close').css({
			top: "-" + $('#toolbar-close').height() + "px"
		});

		this.$el.css({
			'height': this.$el.find('#toolbar-handle').outerHeight() + 'px',
			'width': '100%'
		});

		this.isContentOpen = false;
	}
});