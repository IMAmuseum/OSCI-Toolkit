// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.models.Figure = OsciTk.models.BaseModel.extend({
		defaults: function() {
			return {
				section_id: null,
				delta: null,
				caption: null,
				position: null,
				columns: null,
				body: null,
				options: {}
			};
		},
		
		sync: function(method, model, options) {
			console.log('Figure.sync: ' + method);
		}
	});
});