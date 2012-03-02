var OsciTkSection = Backbone.Model.extend({
	
	defaults: function() {
		return {
			title: null,
			body: null,
			uri: null,
			footnotes: [],
			figures: [],
			media_type: 'application/xhtml+xml',
			footnote_collection: null
		};
	},	

	sync: function(method, model, options) {
		console.log('OsciTkSection.sync: ' + method);
		
		if (method == 'update') {			
			
			if (this.attributes.xml == null) {
			
				var xml_doc = loadXMLDoc(this.attributes.uri);				
				// Error check?

				// Should the following be in a parse function?

				var attribs = {footnotes: [], figures: []};

				attribs['title'] = $(xml_doc).find('.field-name-field-osci-tk-title div div').html();
				attribs['body'] =  $(xml_doc).find('.field-name-field-body div div').html();

				var section = this;

				$(xml_doc).find('#footnotes aside').each(function() {
					attribs.footnotes.push(this.id);
					options.footnote_collection.create({
						id: this.id,
						section_id: section.id,
						body: $(this).html()
					});
				});

				$(xml_doc).find('#figures figure').each(function() {
					attribs.figures.push(this.id);
					var figure = $(this);
					options.figure_collection.create({
						id: this.id,
						section_id: section.id,
						position: figure.attr('data-position'),
						columns: figure.attr('data-columns'),
						options: eval(figure.attr('options')),
						caption: $('figcaption', figure).html(),
						content: $('.figure_content', figure).html()
					});
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