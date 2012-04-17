app = {
	dispatcher : undefined,
	router : undefined,
	config : undefined,
	views : {},
	models : {},
	collections : {},

	bootstrap : function(config)
	{
		this.config = new OsciTk.models.Config(config);
		this.dispatcher = _.extend({}, Backbone.Events);
		this.router = new OsciTk.router();
		this.models.account = new OsciTk.models.Account(null);
		this.views.app = new OsciTk.views.App();
		
		//
		// init global collections
		//
		this.collections.notes = new OsciTk.collections.Notes();
		this.collections.sections = new OsciTk.collections.Sections();
		this.collections.figures = new OsciTk.collections.Figures();
		this.collections.footnotes = new OsciTk.collections.Footnotes();
		
		//setup window resizing, to trigger an event
		window.onresize = function()
		{
			if (window.resizeTimer) {
				clearTimeout(window.resizeTimer);
			}

			var onWindowResize = function(){
				app.dispatcher.trigger("windowResized");
			};

			window.resizeTimer = setTimeout(onWindowResize, 100);
		};

		// load package document
		this.models.docPackage = new OsciTk.models.Package({url: this.config.get('package_url')});
	},

	run : function()
	{
		Backbone.history.start();
	}
};