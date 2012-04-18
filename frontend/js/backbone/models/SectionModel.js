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
				contentLoaded: false,
				numPages: 0
			};
		},
	
		sync: function(method, model, options) {
			// console.log('OsciTkSection.sync: ' + method);
		},
	
		parse: function(response) {
			console.log('parse section');
		},
		
		loadContent: function() {
			var body = null;
			if (this.get('contentLoaded') === false) {
				var data = (loadXMLDoc(this.get('href')));

				body = $(data.body);
				this.set('title', data.title);
				this.set('body', body.html());
				this.set('contentLoaded', true);
			}

			if (body === null)
			{
				body = $(this.get('body'));
			}
			
			// parse out footnotes and figures, make them available via event
			var footnotes = body.find('section#footnotes');
			var figures   = body.find('figure');
			app.dispatcher.trigger('footnotesAvailable', footnotes);
			app.dispatcher.trigger('figuresAvailable', figures);
			app.dispatcher.trigger('sectionLoaded', this);
			console.log(this, 'loaded section');
		}
	});
});
