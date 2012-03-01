var OsciTkNote = Backbone.Model.extend({
	defaults: function() {
		return {
			id: null,
			note: null,
			section_id: null,
			paragraph_id: null,
			tags: []
		};
	},
	
	sync: function(method, model, options) {
		var endpoint = '/api/notes';
		
		console.log('Note.sync: ' + method);
		console.log(model, 'model');
		console.log(options, 'options');
		
		if (method == 'create') {
			var data = {};
			return $.post(endpoint, data, options);
		}
	}
});