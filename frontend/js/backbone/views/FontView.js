// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.Font = OsciTk.views.BaseView.extend({
	className: 'font-view',
	template: OsciTk.templateManager.get('font'),
	initialize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(this.template());
	}
});