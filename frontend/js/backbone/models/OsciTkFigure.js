var OsciTkFigure = Backbone.Model.extend({
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
		console.log('Figure.sync: ' + method);
	}
});