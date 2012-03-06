var OsciTkFootnote = Backbone.Model.extend({
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