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
	
	initialize: function(attributes, options) {
		this.bind('error', function(model, error) {
			console.log([model, error], 'error fired');
		});
	},

	sync: function(method, model, options) {
		var endpoint = OsciTk.settings.endpoints.OsciTkNote;
		
		console.log('Note.sync: ' + method);
		console.log(model, 'model');
		console.log(options, 'options');

		if (method == 'create') {
			// convert the model attributes to standard form encoding
			options.data = '';
			for (var key in model.attributes) {
				if ($.isArray(model.attributes[key])) {
					for (var element in model.attributes[key]) {
						options.data = options.data + key + '=' + model.attributes[key][element];
					}
				}
				else {
					options.data = options.data + key + '=' + model.attributes[key] + '&';
				}
			}
			// all responses are successful by design, check the returned success attribute for real status
			// and properly error if necessary
			options.success = function(data, textStatus, jqXHR) {
				response = JSON.parse(data);
				if (!response.success) {
					options.error(model, jqXHR);
				}
			}
			options.type = 'POST';
			$.ajax(endpoint, options);
		}
	}
});
