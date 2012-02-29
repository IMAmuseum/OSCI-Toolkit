jQuery(function() {
	var $ = jQuery;
	
	/**
	 * Models
	 */
	
	window.Note = Backbone.Model.extend({
		defaults: function() {
			return {
				body: '',
				section_id: '',
				paragraph_id: '',
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
	
	window.Figure = Backbone.Model.extend({
		defaults: function() {
			return {
				asset_id: '',
				section_id: '',
				delta: '',
				number_template: '',
				caption: '',
				position: '',
				columns: '',
				options: {}
			};
		},
		
		sync: function(method, model, options) {
			console.log('Note.sync: ' + method);
		}
	});
	
	window.Footnote = Backbone.Model.extend({
		defaults: function() {
			return {
				body: '',
				section_id: '',
				delta: ''
			};
		},
		
		sync: function(method, model, options) {
			console.log('Note.sync: ' + method);
		}
	});
	
	/**
	 * Collections
	 */
	
	window.Notes = Backbone.Collection.extend({
		model: Note
	});
	
	window.Figures = Backbone.Collection.extend({
		model: Figure
	});
	
	window.Footnotes = Backbone.Collection.extend({
		model: Footnote
	});
});