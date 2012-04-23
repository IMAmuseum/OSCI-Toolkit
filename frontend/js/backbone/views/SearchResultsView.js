// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.SearchResults = OsciTk.views.BaseView.extend({
		id: 'search-results-container',
		template: _.template($('#template-search-results').html()),
		initialize: function(response) {
			console.log(response);
			this.searchResults = new OsciTk.collections.SearchResults({docs: response.docs});
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});