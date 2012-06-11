// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.Title = OsciTk.views.BaseView.extend({
	className: 'title-view',
	template: OsciTk.templateManager.get('title'),
	initialize: function() {
		app.dispatcher.on('packageLoaded', function(packageModel) {
			var metadata = packageModel.get("metadata");
			if (metadata['dc:title'] && metadata['dc:title']['value']) {
				this.$el.find("#publication-title").text(metadata['dc:title']['value']);
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