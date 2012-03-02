var OsciTkSection = Backbone.Model.extend({
	
	defaults: function() {
		return {
			xml: null,
			uri: null,
			media_type: 'application/xhtml+xml'
		};
	},	

	sync: function(method, model, options) {
		console.log('OsciTkSection.sync: ' + method);
		
		if (method == 'update') {			
			
			if (this.attributes.xml == null) {
			
				var xml_doc = loadXMLDoc(this.attributes.uri);				
				// Error check?
				
				this.set({xml: xml_doc});	
				
			} else {
				
				// Already loaded... check modification time?
				
			}
			
		}
		
	}
	
});