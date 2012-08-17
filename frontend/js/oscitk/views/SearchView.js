// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.Search = OsciTk.views.BaseView.extend({
	id: 'search-view',
	className: 'toolbar-item-view',
	template: OsciTk.templateManager.get('search'),
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
	resizeResultsContainer: function() {
		var containerSize = $('#toolbar-content').height();
		var searchHeaderSize = $('#search-header', this.$el).outerHeight();
		var searchResultsHeaderSize = $('#search-results-header', this.$el).outerHeight();

		var newContainerHeight = containerSize - searchHeaderSize - searchResultsHeaderSize;
		$('#search-results-container', this.$el).height(newContainerHeight);
	},
	search: function(event) {
		// prevent the form from submitting
		event.preventDefault();
		var keyword = this.query = this.$el.find('#search-keyword').val();

		// send search query
		var searchView = this;
		$.ajax({
			url: app.config.get('endpoints')['OsciTkSearch'] + '?key=' + keyword,
			type: 'POST',
			success: function(data) {
				var response = JSON.parse(data);
				// reset collection
				searchView.searchResults.reset();
				// add the incoming docs to the searchResults collection
				_.each(response.docs, function(doc) {
					searchView.searchResults.add(doc);
				});
				searchView.searchResults.numFound = response.numFound;
				// set the keyword to the collection
				searchView.searchResults.keyword = keyword;
				// re-render the search view
				searchView.render();
				searchView.parent.contentOpen();
				searchView.resizeResultsContainer();
			}
		});
	}
});