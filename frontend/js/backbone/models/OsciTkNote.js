jQuery(function() {
	window.OsciTkNote = Backbone.Model.extend({
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
				options.data = this.urlFormEncode(model);
				// all responses are successful by design, check the returned success attribute for real status
				// and properly error if necessary
				options.success = function(data, textStatus, jqXHR) {
					var response = JSON.parse(data);
					if (!response.success) {
						options.error(model, jqXHR);
					}
				};
				options.type = 'POST';
				$.ajax(endpoint, options);
			}
	
			if (method == 'update') {
				options.data = this.urlFormEncode(model);
				options.success = function(data, textStatus, jqXHR) {
					var response = JSON.parse(data);
					console.log(response, 'update response');
					if (!response.success) {
						options.error(model, jqXHR);
					}
				};
				options.type = 'POST';
				$.ajax(endpoint, options);
			}
	
			if (method == 'delete') {
				options.data = this.urlFormEncode(model);
				options.data = options.data + 'delete=1';
				options.type = 'POST';
				options.success = function(data, textStatus, jqXHR) {
					var response = JSON.parse(data);
					console.log(response, 'delete response');
					if (!response.success) {
						options.error(model, jqXHR);
					}
				}
				$.ajax(endpoint, options);
			}
		},
		
		urlFormEncode: function(model) {
			var data = '';
			for (var key in model.attributes) {
				if ($.isArray(model.attributes[key])) {
					for (var element in model.attributes[key]) {
						data = data + key + '[]=' + model.attributes[key][element] + '&';
					}
				}
				else {
					data = data + key + '=' + model.attributes[key] + '&';
				}
			}
			return data;
		}
	});
});