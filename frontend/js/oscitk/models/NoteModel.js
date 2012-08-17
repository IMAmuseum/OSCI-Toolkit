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
		this.on('error', function(model, error) {
			console.log([model, error], 'error fired');
		});
	},

	sync: function(method, model, options) {
		var endpoint = app.config.get('endpoints').OsciTkNote;

		console.log('Note.sync: ' + method);
		console.log(model, 'model');
		console.log(options, 'options');

		switch (method) {
			case 'create':
				// convert the model attributes to standard form encoding
				options.data = model.toJSON();
				delete options.data.id;
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
						model.set('id', response.note.id);
						model.trigger('change');
					}
				};
				options.type = 'POST';
				$.ajax(endpoint, options);
				break;

			case 'update':
				options.data = model.toJSON();
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
				break;

			case 'delete':
				options.data = model.toJSON();
				options.data['delete'] = 1;
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
				break;
		}
	}
});