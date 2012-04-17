// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.SearchResults = OsciTk.views.BaseView.extend({
		id: 'search-results-container',
		template: _.template($('#template-search-results').html()),
		initialize: function(results) {
			console.log(results);
			this.collection = new OsciTk.collections.SearchResults();
			//this.collection.reset(results);
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});