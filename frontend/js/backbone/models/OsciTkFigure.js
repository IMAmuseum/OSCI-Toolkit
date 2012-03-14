jQuery(function() {
	window.OsciTkFigure = OsciTkModel.extend({
		defaults: function() {
			return {
				asset_id: null,
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