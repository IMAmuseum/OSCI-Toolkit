// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.models.SearchResult = OsciTk.models.BaseModel.extend({
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