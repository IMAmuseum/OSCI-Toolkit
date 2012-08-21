OsciTk.views.App = OsciTk.views.BaseView.extend({
	id: 'reader',

	initialize: function() {
		$('body').append(this.el);

		// Add the title view to the appView
		app.views.titleView = new OsciTk.views.Title();
		this.addView(app.views.titleView);

		// Add the toolbar to the appView
		app.views.toolbarView = new OsciTk.views.Toolbar();
		this.addView(app.views.toolbarView);

		//set the default section view
		var sectionViewClass = OsciTk.views.Section;

		//allow a custom section view to be used
		if (app.config.get('sectionView') && OsciTk.views[app.config.get('sectionView')]) {
			sectionViewClass = OsciTk.views[app.config.get('sectionView')];
		}
		var sectionViewOptions = {};
		if (app.config.get('sectionViewOptions')) {
			sectionViewOptions = app.config.get('sectionViewOptions');
		}
		app.views.sectionView = new sectionViewClass(sectionViewOptions);
		this.addView(app.views.sectionView);

		// Add the navigation view to the AppView
		app.views.navigationView = new OsciTk.views.Navigation();
		this.addView(app.views.navigationView);

		// Add the footnotes view to the AppView
		app.views.footnotesView = new OsciTk.views.Footnotes();

		// Add the inline notes view to the AppView
		app.views.inlineNotesView = new OsciTk.views.InlineNotes();

		// Add the citation view to the AppView
		app.views.citationView = new OsciTk.views.Citation();
	}
});