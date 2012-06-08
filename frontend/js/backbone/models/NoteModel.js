// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.Note = OsciTk.models.BaseModel.extend({
	defaults: function() {
		return {
			id: null,
			content_id: null,
			section_id: null,
			note: null,
			tags: []
		};
	},
	
	initialize: function(attributes, options) {
		this.bind('error', function(model, error) {
			console.log([model, error], 'error fired');
		});
	},

	sync: function(method, model, options) {
		var endpoint = app.config.get('endpoints').OsciTkNote;
		
		console.log('Note.sync: ' + method);
		console.log(model, 'model');
		console.log(options, 'options');

		if (method == 'create') {
			// convert the model attributes to standard form encoding
			options.data = this.urlFormEncode(model);
			// all response codes are successful by design, check 
			// the returned success attribute for real status
			// and properly error if necessary
			options.success = function(data, textStatus, jqXHR) {
				var response = JSON.parse(data);
				console.log(response, 'response');
				if (!response.success) {
					options.error(model, jqXHR);
				}
				else {
					model.id = response.note.id;
					model.trigger('change');
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
				else {
					model.trigger('change');
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
				else {
					model.trigger('change');
				}
			};
			$.ajax(endpoint, options);
		}
	},
	
	urlFormEncode: function(model) {
		var data = '';
		for (var key in model.attributes) {
			if (model.attributes[key] === null) {
				continue;
			}
			else if ($.isArray(model.attributes[key])) {
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