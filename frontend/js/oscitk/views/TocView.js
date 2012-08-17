OsciTk.views.Toc = OsciTk.views.BaseView.extend({
	className: 'toc-view',
	template: OsciTk.templateManager.get('toc'),
	events: {
		'click li a': 'itemClick'
	},
	initialize: function() {
		this.parent = this.options.parent;

		app.dispatcher.on("currentNavigationItemChanged", function() {
			this.render();
		}, this);
	},
	render: function() {
		this.$el.html(this.template({
			items: app.collections.navigationItems.where({depth: 0})
		}));
	},
	itemClick: function(event) {
		event.preventDefault();

		var sectionId = $(event.currentTarget).attr('data-section-id');
		// app.dispatcher.trigger('navigateToSection', sectionId);
		// TODO: don't really want to address the appRouter directly
		app.router.navigate("section/" + sectionId, {trigger: true});
		app.views.toolbarView.contentClose();
	},
	active: function() {
		var containerSize = $('#toolbar-content').height();
		var headerSize = this.$el.find("h3").outerHeight();

		var newContainerHeight = containerSize - headerSize;
		this.$el.find("ul").height(newContainerHeight);
	}
});