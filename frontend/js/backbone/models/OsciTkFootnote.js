jQuery(function() {
	window.OsciTkFootnote = OsciTkModel.extend({
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
});