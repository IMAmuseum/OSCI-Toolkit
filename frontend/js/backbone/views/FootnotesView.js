// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.Footnotes = OsciTk.views.BaseView.extend({
	id: 'footnote',
	initialize: function() {
		// listen to layoutComplete event
		app.dispatcher.on('layoutComplete', function(params) {
			// find all footnote links in the section content
			var fnLinks = app.views.sectionView.$el.find('a.footnote-reference');
			_.each(fnLinks, function(link) {
				link = $(link);
				// is there a matching footnote?
				var id = link.attr('href').slice(1);
				var fn = app.collections.footnotes.get(id);
				if (fn) {
					link.qtip({
						content: fn.get('body')
					});
				}
			});
		}, this);
	}
});