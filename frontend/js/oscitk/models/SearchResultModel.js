// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.SearchResult = OsciTk.models.BaseModel.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];
		if(attr === 'bundle') {
			var val = this.attributes[attr];
			if(val === 'footnote' || val === 'notes' || val === 'figures') {
				return val;
			} else {
				return 'content';
			}
		} else {
			return this.attributes[attr];
		}
	}
});