// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.collections.Pages = OsciTk.collections.BaseCollection.extend({
		model : OsciTk.models.Page,
		rawContent : undefined,
		contentUrl : undefined,
		initialize : function()
		{
			// bind sectionChanged
			app.dispatcher.on('currentNavigationItemChanged', function() {
				var navItem = app.collections.navigationItems.getCurrentNavigationItem();
				this.contentUrl = navItem.get('href');
				this.rawContent = undefined;
				this.loadContent();
			}, this);
		},
		loadContent: function() {
			var body = null;
			if (this.rawContent === undefined) {
				var data = (loadXMLDoc(this.contentUrl));

				body = $(data.body);
				this.rawContent = body.html();
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
			app.dispatcher.trigger('contentLoaded', this);
			console.log(this, 'loaded section');
		}
	});
});