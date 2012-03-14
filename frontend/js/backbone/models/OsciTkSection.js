jQuery(function() {
	window.OsciTkSection = OsciTkModel.extend({
		
		defaults: function() {
			return {
				title: null,
				body: null,
				uri: null,
				media_type: 'application/xhtml+xml',
			};
		},	
	
		sync: function(method, model, options) {
			console.log('OsciTkSection.sync: ' + method);
		},
	
		parse: function(response) {
			console.log('parse section');
		},
		
		loadContent: function() {
			var data = (loadXMLDoc(this.get('href')));
			this.set('rawData', data);
			this.set('title', $('section.title', data.body).html());
			this.set('body', $('section.body', data.body).html());
			// parse out footnotes and figures, make them available via event
			var footnotes = $('section#footnotes', data.body);
			var figures   = $('section#figures', data.body);
			this.dispatcher.trigger('footnotesAvailable', footnotes);
			this.dispatcher.trigger('figuresAvailable', figures);
			console.log(this, 'loaded section');
		}
	});
});