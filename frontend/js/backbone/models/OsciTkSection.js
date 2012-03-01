var OsciTkSection = Backbone.Model.extend({
	defaults: function() {
		return {
			body: null,
			section_id: null,
			uri: null,
			media_type: 'application/xhtml+xml'
		};
	},
	

	fetch: function(options) {

		// TODO: custom fetch
		var xml = loadXMLDoc(this.attributes.uri);		
		
		return;
		
	},
	
	
	sync: function(method, model, options) {
		console.log('OsciTkSection.sync: ' + method);
	}
	
});