OsciTk.models.Page = OsciTk.models.BaseModel.extend({

	defaults: function() {
		return {
			content : [],
			pageNumber : 0
		};
	},

	addContent : function(newContent) {
		var content = this.get('content');
		content.push(newContent);

		return this;
	},

	removeContentAt : function(index) {
		var content = this.get('content');
		content.splice(index, 1);

		return this;
	},

	removeAllContent : function() {
		this.set('content', []);
	},

	contentLength : function() {
		return this.get('content').length;
	}
});