jQuery(function() {
	window.OsciTKSearchResult = OsciTkModel.extend({
		defaults: function() {
			return {
				id: null,
				label: null,
				url: null,
				teaser: null,
				is_book_bid: null,
				sm_path_hierarchy: null,
				sm_path_hierarchy_depth: null,
				score: null
			};
		},
		loadContent: function() {
			console.log(this, 'loaded search');
		}	
	});
});