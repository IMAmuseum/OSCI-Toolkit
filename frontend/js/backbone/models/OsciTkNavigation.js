var OsciTkNavigation = Backbone.Model.extend({
	
	defaults: function() {
		return {
			uri: null,
			toc: null,
			current_section: null
		};
	},	

	fetch: function(options) {
		
		//console.log('OsciTkNavigation.fetch');

		var data = xmlToJson(loadXMLDoc(this.attributes.uri));		
		
		var nav = data.html[1].body.nav;
		
		for (var i in nav) {
			
			this.attributes[nav[i].type] = nav[i]
			
		}
		
		// Go to the beginning if we haven't started yet
		if (this.current_section == null) {
			this.goToBeginning();
		}
				
	},
	
	goToBeginning: function() {
		this.set({current_section: this.attributes['toc'].ol.li[0].a});
	}
	
});