OsciTk.models.Section = OsciTk.models.BaseModel.extend({
	defaults: function() {
		return {
			title: null,
			content: null,
			uri: null,
			media_type: 'application/xhtml+xml',
			contentLoaded: false,
			pages: new OsciTk.collections.Pages()
		};
	},

	sync: function(method, model, options) {
		// console.log('OsciTkSection.sync: ' + method);
	},

	parse: function(response) {
		console.log('parse section');
	},

	loadContent: function() {
		var content = null;
		if (this.get('contentLoaded') === false) {
			var data = (loadXMLDoc(this.get('uri')));

			content = $(data);
			this.set('title', data.title);
			this.set('content', content);
			this.set('contentLoaded', true);
		}

		if (content === null) {
			content = $(this.get('content'));
		}

		// parse out footnotes and figures, make them available via event
		var footnotes = content.find('section#footnotes');
		var figures   = content.find('figure');
		app.dispatcher.trigger('footnotesAvailable', footnotes);
		app.dispatcher.trigger('figuresAvailable', figures);
		app.dispatcher.trigger('sectionLoaded', this);
	},

	removeAllPages : function() {
		this.set('pages', new OsciTk.collections.Pages());
	}
});