var OsciTkSection = Backbone.Model.extend({
	
	defaults: function() {
		return {
			title: null,
			body: null,
			uri: null,
			footnotes: {},
			figures: {},
			media_type: 'application/xhtml+xml'
		};
	},	

	sync: function(method, model, options) {
		console.log('OsciTkSection.sync: ' + method);
		
		if (method == 'update') {			
			
			if (this.attributes.xml == null) {
			
				var xml_doc = loadXMLDoc(this.attributes.uri);				
				// Error check?

				// Should the following be in a parse function?

				var attribs = {footnotes: {}, figures: {}};

				attribs['title'] = $(xml_doc).find('.field-name-field-osci-tk-title div div').html();
				attribs['body'] =  $(xml_doc).find('.field-name-field-body div div').html();

				// Maybe the footnote should be created here?
				$(xml_doc).find('#footnotes aside').each(function() {
					attribs.footnotes[this.id] = $(this).html();
				});

				// Ditto for figures?
				$(xml_doc).find('#figures figure').each(function() {
					attribs.figures[this.id] = $(this).html();
				});

				this.set(attribs);
				
			} else {
				
				// Already loaded... check modification time?
				
			}
			
		}
		
	},

	parse: function(response) {
		console.log('parse');

	}

	
});