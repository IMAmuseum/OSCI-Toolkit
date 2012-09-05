OsciTk.views.Search = OsciTk.views.BaseView.extend({
	id: 'search-view',
	className: 'toolbar-item-view',
	template: OsciTk.templateManager.get('search'),
	initialize: function() {
		// define defaults for the query
		this.query = {
			page: 0,
			keyword: null,
			filters: [],
			sort: null
		};

		// define results object
		this.response = {
			numFound: 0,
			docs: new OsciTk.collections.SearchResults(),
			facets: null
		};
		this.results = null;
		this.hasSearched = false;
		this.isLoading = false;
		this.resultsTemplate = OsciTk.templateManager.get('search-results');
	},
	events: {
		'submit #search-form': 'submitSearch',
		'click .search-result': 'gotoResult',
		'click .facet': 'addFacet',
		'click .filter': 'addFilter',
		'click #reset-search': 'resetSearch'
	},
	render: function() {
		this.$el.html(this.template(this));
	},
	renderResults: function() {
		this.prepareResults();
		this.$el.find("#search-results-wrapper").html(this.resultsTemplate(this));
	},
	resizeResultsContainer: function() {
		var containerSize = $('#toolbar-content').height();
		var searchHeaderSize = this.$el.find('#search-header').outerHeight();
		var resultsHeaderSize = this.$el.find('#search-results-header').outerHeight();

		var newContainerHeight = containerSize - searchHeaderSize - resultsHeaderSize;
		this.$el.find('#search-results-container').height(newContainerHeight);
	},
	search: function() {
		var that = this;

		// set keyword
		this.query.keyword = this.$el.find('#search-keyword').val();
		// reset collection
		this.response.docs.reset();
		// let the template know that we can now display results
		this.hasSearched = true;

		// build query params to send to api
		var queryParams = {
			key: this.query.keyword,
			group: 'true',
			page: this.query.page
		};

		if (this.query.filters.length) {
			queryParams['filters'] = this.query.filters.join(' ');
		}

		// send search query
		$.ajax({
			url: app.config.get('endpoints')['OsciTkSearch'],
			data: queryParams,
			success: function(data) {
				data = JSON.parse(data);
				if(data.numFound === 0) return;

				// add the incoming docs to the results collection
				that.response.docs.reset(data.docs);
				that.response.facets = data.facets;
				that.response.numFound = data.numFound;
				// re-render the search view
				that.renderResults();
				// handle container resizing
				app.views.toolbarView.contentOpen();
				that.resizeResultsContainer();
				// set scroll position to last known
			},
			error: function() {
				// error handling
			}
		});
	},
	prepareResults: function() {
		this.results = _.groupBy(this.response.docs.models, function(doc) {
			return doc.get('ss_section_id');
		});
	},
	gotoResult: function(e) {
		var $elem = $(e.currentTarget);
		var resultModel = this.response.docs.get($elem.data("id"));

		app.router.navigate("section/" + resultModel.get("ss_section_id") + "/" + resultModel.get("id"), {trigger: true});
		app.views.toolbarView.contentClose();
	},
	addFilter: function(e) {
		e.preventDefault();
		var filter = $(e.currentTarget).data('filter');
		var exists = _.indexOf(this.query.filters, filter);

		this.$el.find(".filter").removeClass("active");

		//remove type filters (only one at a time)
		this.query.filters = _.reject(this.query.filters, function(filter) {
			return filter.indexOf("type:") === 0;
		});

		//if filter wasn't in list add it
		if (exists === -1) {
			this.query.filters.push(filter);
			$(e.currentTarget).addClass("active");
		}

		if (this.hasSearched) {
			this.search();
		}
	},
	addFacet: function(e) {
		e.preventDefault();
		var facet = $(e.currentTarget).data('filter');
		this.query.filters.push(facet);

		if (this.hasSearched) {
			this.search();
		}
	},
	submitSearch: function(e) {
		e.preventDefault();
		this.search();
	},
	resetSearch: function(e) {
		e.preventDefault();
		e.stopPropagation();

		this.initialize();
		this.$el.find("#search-results-header").remove();
		this.$el.find("#search-results-container").remove();
		this.$el.find("#search-keyword").val("");

		app.views.toolbarView.contentOpen();
		this.resizeResultsContainer();
	}
});