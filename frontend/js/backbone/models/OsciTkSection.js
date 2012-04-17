// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.models.Section = OsciTk.models.BaseModel.extend({
		idAttribute: "data-section_id",

		defaults: function() {
			return {
				title: null,
				body: null,
				uri: null,
				media_type: 'application/xhtml+xml',
				contentLoaded: false
			};
		},
	
		sync: function(method, model, options) {
			// console.log('OsciTkSection.sync: ' + method);
		},
	
		parse: function(response) {
			console.log('parse section');
		},
		
		loadContent: function() {
			if (this.get('contentLoaded') === false) {
				var data = (loadXMLDoc(this.get('href')));
				this.set('title', $('section.title', data.body).html());
				this.set('body', $('section.body', data.body).html());
				this.set('contentLoaded', true);
			}
			
			// parse out footnotes and figures, make them available via event
			var footnotes = $('section#footnotes', this.get('body'));
			var figures   = $('section#figures', this.get('body'));
			this.dispatcher.trigger('footnotesAvailable', footnotes);
			this.dispatcher.trigger('figuresAvailable', figures);
			console.log(this, 'loaded section');
		}
	});
});