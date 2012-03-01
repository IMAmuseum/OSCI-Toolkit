var OsciTkSection = Backbone.Model.extend({
	defaults: function() {
		return {
			body: null,
			section_id: null,
		};
	},
	
	/*
	 * Fetch expects the url for the host
	 */
	fetch: function(options) {

		// TODO: custom fetch
		return;
		
	},
	
	
	sync: function(method, model, options) {
		console.log('OsciTkSection.sync: ' + method);
	}
	
});