OsciTk.models.Footnote = OsciTk.models.BaseModel.extend({
	defaults: function() {
		return {
			body: '',
			section_id: '',
			delta: ''
		};
	},

	sync: function(method, model, options) {
		console.log('Footnote.sync: ' + method);
	}
});