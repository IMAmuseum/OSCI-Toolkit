// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initialization //

OsciTk.collections.SearchResults = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.SearchResult
});