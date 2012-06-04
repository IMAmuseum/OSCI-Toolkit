// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.InlineNotes = OsciTk.views.BaseView.extend({
	initialize: function() {
		app.dispatcher.on('pageChanged', function(pageChanged) {
			// get the current page
			var page = app.views.sectionView.childViews[pageChanged.page - 1];
			
			// find the content ids in the page
			var anchors = page.$el.find('[id^="osci-content-"]');
			
			// try to match an anchor with a previously retrieved note
			console.log(app.collections.notes);
			_.each(anchors, function(anchor) {
				console.log(anchor);
			}, this);
		}, this);
	}
});