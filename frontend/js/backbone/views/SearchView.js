// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Search = OsciTk.views.BaseView.extend({
		id: 'search-view',
		className: 'toolbar-item-view',
		template: _.template($('#template-search').html()),
		searchResults: new OsciTk.collections.SearchResults(),
		page: 0,
		query: '',
		filters: null,
		sort: null,
				
		initialize: function() {
			// add our search results collection to the global namespace for convenience
			if (app && app.collections) app.collections.searchResults = this.searchResults;
		},
		
		events: {
			'submit #search-form' : 'search'
		},
		
		render: function() {
			this.$el.html(this.template(this));
		},
		
		search: function(event) {
			// prevent the form from submitting
			event.preventDefault();
			var keyword = this.query = this.$el.find('#search-keyword').val();

			// send search query
			var searchView = this;
			$.ajax({
				url: app.config.get('endpoints')['OsciTkSearch'] + '?key=' + keyword + '&filters=type:note',
				type: 'POST',
				success: function(data) {
					var response = JSON.parse(data);
					// add the incoming docs to the searchResults collection
					_.each(response.docs, function(doc) {
						searchView.searchResults.add(doc);
					});
					// set the keyword to the collection
					searchView.searchResults.keyword = keyword;
					// re-render the search view
					searchView.render();
					searchView.parent.contentOpen();
				}
			});
		}
	});
});