jQuery(function() {
	window.OsciTkSearchResult = OsciTkModel.extend({
		defaults: function() {
			return {
				entity_id: null,
				bundle: null,
				label: null,
				url: null,
				teaser: null,
				is_book_bid: null,
				sm_path_hierarchy: null,
				sm_path_hierarchy_depth: null,
				score: null
			};
		}
	});
});