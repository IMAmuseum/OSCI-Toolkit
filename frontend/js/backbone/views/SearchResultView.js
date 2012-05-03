// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.SearchResult = OsciTk.views.BaseView.extend({
	id: 'search-results-container',
	template: OsciTk.templateManager.get('search-result'),
	initialize: function(results) {
		this.render();
	},
	render: function() {
		this.$el.html(this.template());
	}
});