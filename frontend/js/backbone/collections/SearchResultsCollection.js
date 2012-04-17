// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.collections.SearchResults = OsciTk.collections.BaseCollection.extend({
		model: OsciTk.models.SearchResult,
		initialize: function() {
			this.numFound = 0;
			this.page = 0;
		}
	});
});