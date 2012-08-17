OsciTk.views.Title = OsciTk.views.BaseView.extend({
	className: 'title-view',
	template: OsciTk.templateManager.get('title'),
	initialize: function() {
		app.dispatcher.on('packageLoaded', function(packageModel) {
			var title = packageModel.getTitle();
			if (title) {
				this.$el.find("#publication-title").text(title);
			}
		}, this);

		this.render();
	},
	render: function() {
		this.$el.html(this.template());
		return this;
	},
	events: {
		"click #publication-title": function(e) {
			e.preventDefault();
			app.dispatcher.trigger('navigate', {identifier: "start"});
		}
	}
});